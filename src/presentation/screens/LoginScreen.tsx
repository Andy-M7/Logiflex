import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Importamos el UseCase funcional (asegúrate de que la ruta sea correcta)
import { LoginUseCase } from '../../domain/useCases/login.usecase';

// Definición de tipos de navegación
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
};
type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const isDark = useColorScheme() === 'dark';

  // Estados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [seePass, setSeePass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onLogin = async () => {
    setErr(null);
    const mail = email.trim();
    const pass = password;

    if (!mail || !pass) {
      setErr('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      // LLAMADA AL CASO DE USO (Función directa)
      const user = await LoginUseCase(mail, pass);
      
      console.log('Login exitoso:', user);

      // Navegación al Home (Reset para borrar historial)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (e: unknown) {
      console.log('Error LoginScreen:', e);
      // Manejo de error simple para mostrar en UI
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  // Tema de colores
  const theme = {
    bg: isDark ? '#0E0F12' : '#F7F8FA',
    card: isDark ? '#15171C' : '#FFFFFF',
    text: isDark ? '#E5E7EB' : '#0E1116',
    textSec: isDark ? '#9AA1AC' : '#6B7280',
    inputBg: isDark ? '#0F1115' : '#F9FAFB',
    inputBorder: isDark ? '#272B33' : '#D1D5DB',
    primary: '#4C6EF5',
    error: '#ef4444',
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        
        {/* Header / Logo */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="truck-cargo-container" size={40} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>LogiFlex</Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.textSec }]}>Bienvenido de nuevo</Text>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.text }]}>Correo electrónico</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="usuario@logiflex.com"
            placeholderTextColor={theme.textSec}
            style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          />

          <Text style={[styles.label, { color: theme.text }]}>Contraseña</Text>
          <View style={[styles.passContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!seePass}
              placeholder="********"
              placeholderTextColor={theme.textSec}
              style={[styles.inputPass, { color: theme.text }]}
            />
            <Pressable onPress={() => setSeePass(!seePass)} style={styles.eyeIcon}>
              <MaterialCommunityIcons name={seePass ? 'eye-off' : 'eye'} size={24} color={theme.textSec} />
            </Pressable>
          </View>
        </View>

        {/* Mensaje de Error */}
        {!!err && (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.error} />
            <Text style={[styles.errorText, { color: theme.error }]}>{err}</Text>
          </View>
        )}

        {/* Botón Ingresar */}
        <Pressable 
          style={({ pressed }) => [styles.btn, { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 }]} 
          onPress={onLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Ingresar</Text>
          )}
        </Pressable>

        {/* Footer Registro */}
        <Pressable onPress={() => navigation.navigate('Register')} style={styles.footer}>
          <Text style={{ color: theme.textSec }}>¿No tienes cuenta? <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Regístrate</Text></Text>
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { padding: 24, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.1, shadowRadius: 8 },
  header: { alignItems: 'center', marginBottom: 20, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 16, marginBottom: 24, textAlign: 'center' },
  form: { gap: 12 },
  label: { fontWeight: '600', fontSize: 14, marginLeft: 4, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  passContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14 },
  inputPass: { flex: 1, paddingVertical: 12, fontSize: 16 },
  eyeIcon: { padding: 4 },
  errorBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8 },
  errorText: { fontWeight: 'bold', textAlign: 'center' },
  btn: { marginTop: 24, padding: 16, borderRadius: 14, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  footer: { marginTop: 20, alignItems: 'center' },
});
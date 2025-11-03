import React, { memo, useLayoutEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, useColorScheme, Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const TOKEN_KEY = 'auth:token';

const MODULES = [
  { key: 'Usuarios',     title: 'Usuarios',      subtitle: 'Gestión y Roles',       icon: 'account-group' },
  { key: 'Empleados',    title: 'Empleados',     subtitle: 'Altas y Ediciones',     icon: 'account-tie' },
  { key: 'PackingLists', title: 'Packing Lists', subtitle: 'Listado y Adjuntos',    icon: 'file-document-multiple' },
  { key: 'Productos',    title: 'Productos',     subtitle: 'Catálogo y Lotes',      icon: 'cube-outline' },
  { key: 'Asistencia',   title: 'Asistencia',    subtitle: 'Asistencia del Personal', icon: 'calendar-check' },
] as const;

export default function HomeScreen({ navigation }: Props) {
  const isDark = useColorScheme() === 'dark';
  const C = palette(isDark);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={async () => {
            await AsyncStorage.removeItem(TOKEN_KEY);
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }}
          style={{ paddingHorizontal: 8, paddingVertical: 4 }}
          android_ripple={{ color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
        >
          <MaterialCommunityIcons
            name="logout"
            size={22}
            color={isDark ? '#ECEEF2' : '#0E1116'}
          />
        </Pressable>
      ),
    });
  }, [navigation, isDark]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.grid}>
        {MODULES.map(m => (
          <ModuleCard
            key={m.key}
            title={m.title}
            subtitle={m.subtitle}
            icon={m.icon}
            onPress={() => navigation.navigate(m.key as any)}
            colors={C}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const ModuleCard = memo(function ModuleCard({
  title, subtitle, icon, onPress, colors,
}: {
  title: string; subtitle: string; icon: string; onPress: () => void;
  colors: ReturnType<typeof palette>;
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colors.ripple }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={28} color={colors.icon} />
      </View>
      <Text style={[styles.cardTitle, { color: colors.fg }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.cardSub, { color: colors.muted }]} numberOfLines={2}>
        {subtitle}
      </Text>
    </Pressable>
  );
});

function palette(dark: boolean) {
  if (dark) {
    return {
      bg: '#0E0F12', fg: '#ECEEF2', muted: '#9AA1AC',
      card: '#16181D', border: '#1F2228', ripple: 'rgba(255,255,255,0.08)',
      shadow: '#000', icon: '#9AB6FF',
    };
  }
  return {
    bg: '#F7F8FA', fg: '#0E1116', muted: '#6B7280',
    card: '#FFFFFF', border: '#E5E7EB', ripple: 'rgba(0,0,0,0.06)',
    shadow: '#000', icon: '#4C6EF5',
  };
}

const CARD_W = '45%';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', rowGap: 16,
  },
  card: {
    width: CARD_W, aspectRatio: 1, borderRadius: 18, padding: 16,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
    ...Platform.select({
      ios: { shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 2 },
    }),
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: 12, marginBottom: 10,
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(76,110,245,0.12)',
  },
  cardTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  cardSub: { marginTop: 4, fontSize: 12, textAlign: 'center', lineHeight: 16 },
});

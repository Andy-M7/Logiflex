// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ['module:react-native-dotenv', { moduleName: '@env', path: '.env' }],
      ['babel-plugin-module-resolver', {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@domain': './src/domain',
          '@data': './src/data',
          '@presentation': './src/presentation',
          '@components': './src/presentation/components',
          '@navigation': './src/presentation/navigation',
          '@screens': './src/presentation/screens',
          '@useCases': './src/useCases',
          '@viewModels': './src/viewModels',
        },
      }],
      'react-native-reanimated/plugin', // SIEMPRE al final
    ],
  };
};

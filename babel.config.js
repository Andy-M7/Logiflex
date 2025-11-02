module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.json'],
        alias: {
          '@domain': './src/domain',
          '@data': './src/data',
          '@presentation': './src/presentation',
          '@components': './src/presentation/components',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
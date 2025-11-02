module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};

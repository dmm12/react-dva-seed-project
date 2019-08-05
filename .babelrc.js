// 模块热部署
module.exports = {
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          components: './src/components',
        },
      },
    ],
  ],
};

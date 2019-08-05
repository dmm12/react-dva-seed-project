const path = require('path');
export default {
 entry: './src/index.js',
 publicPath: '/',
 extraBabelPlugins: [
  ["import", { "libraryName": "hzero", "style": "css" }]
 ],
 html: {
  template: "./src/index.ejs"
},
 alias: {
   components: path.resolve(__dirname, 'src/components/'),
   utils: path.resolve(__dirname, 'src/utils/'),
   services: path.resolve(__dirname, 'src/services/')
 },
}

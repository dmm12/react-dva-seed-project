const path = require('path');
const filters = ['antv','codemirror','bizcharts', 'tinymce', 'cropper', 'react-beautiful-dnd','react-grid-layout','react-dnd','react-sortable-pane','dnd-core','react-draggable','react-resizable'];

const API_HOST = process.env.API_HOST ? process.env.API_HOST : 'http://localhost:8080';
const ENV_BASE_PATH = `${process.env.BASE_PATH}`.trim();
const BASE_PATH = ENV_BASE_PATH.length == 0 ? '/' : ENV_BASE_PATH;

export default {
 entry: './src/index.js',
 publicPath:'/',
 commons: [
  {
    async: 'vendor',
    children: true,
    minChunks: function (module, count) {
      const resource = module.resource;
      return (
        resource &&
        /\.js$/.test(resource) &&
        resource.indexOf('node_modules') >= 0 &&
        filters.filter(f => resource.indexOf(f) > 0).length == 0
      );
    },
  },
  {
    async: 'bizcharts',
    children: true,
    minChunks: function (module, count) {
      const resource = module.resource;
      return (
        resource &&
        /\.js$/.test(resource) &&
        resource.indexOf('node_modules') >= 0 &&
        (resource.indexOf('bizcharts') > 0 || resource.indexOf('antv') > 0)
      );
    },
  },
  {
    async: 'codemirror',
    children: true,
    minChunks: function (module, count) {
      const resource = module.resource;
      return (
        resource &&
        /\.js$/.test(resource) &&
        resource.indexOf('node_modules') >= 0 &&
        (resource.indexOf('codemirror') > 0 )
      );
    },
  },
  {
    async: 'tinymce',
    children: true,
    minChunks: function (module, count) {
      const resource = module.resource;
      return (
        resource &&
        /\.js$/.test(resource) &&
        resource.indexOf('node_modules') >= 0 &&
        (resource.indexOf('tinymce') > 0)
      );
    },
  },
  {
    async: 'components',
    children: true,
    minChunks: function (module, count) {
      const resource = module.resource;
      return (
        resource &&
        /\.js$/.test(resource) &&
        resource.indexOf(`src${path.sep}components`) >= 0
      );
    },
  },
 ],
 env: {
  development:{
    extraBabelPlugins: ['dva-hmr'],
  }
 },
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
 define: {
  'process.env.BASE_PATH': BASE_PATH,
  'process.env.API_HOST': API_HOST,
  'process.env.BPM_HOST': process.env.BPM_HOST,
  'process.env.WEBSOCKET_HOST': process.env.WEBSOCKET_HOST,
  'process.env.CLIENT_ID': process.env.CLIENT_ID ? process.env.CLIENT_ID : 'localhost',
  'process.env.AUTH_HOST': `${API_HOST}/oauth`,
  'process.env.SRC_WEBSOCKET_HOST': process.env.SRC_WEBSOCKET_HOST,
  'process.env.PLATFORM_VERSION': process.env.PLATFORM_VERSION,
  'process.env.SRM_MALL_HOST': process.env.SRM_MALL_HOST,
},
}

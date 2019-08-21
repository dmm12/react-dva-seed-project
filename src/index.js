
import dva from "dva";
import 'hzero-ui/dist/hzero-ui.css';
import './index.less';

const {createBrowserHistory} = require("history");

const basePath = process.env.BASE_PATH;

const browserHistoryBuildOptions = {};
if (basePath !== '/') {
  browserHistoryBuildOptions.basename = basePath;
}

// const createHistory =require('history/createBrowserHistory');
// 1. Initialize
const app = dva({
  history: createBrowserHistory(),
 // createHistory(),
});

// 1.1 attach dva app to window
window.dvaApp = app;

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// model
app.model(require("./models/global").default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

if (process.env.NODE_ENV !== 'development') {
  // 只有在非开发模式下才监听全局错误
  // 开发模式 webpack-dev 会自动将错误的显示出来
  window.addEventListener('error', dealGlobalError);
}

function dealGlobalError(){}


import dva from "dva";
import createHistory from 'history/createBrowserHistory';
import 'hzero-ui/dist/hzero-ui.css';
import './index.less';

// const createHistory =require('history/createBrowserHistory');
// 1. Initialize
const app = dva({
  history: createHistory(),
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

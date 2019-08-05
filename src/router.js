/**
 * 此处定义动态路由的模板
 */
import React from 'react';
import { Switch, Route, Redirect, routerRedux } from 'dva/router';
import dynamic from 'dva/dynamic';
import { LocaleProvider, Spin } from 'hzero-ui';
import zhCN from 'hzero-ui/lib/locale-provider/zh_CN';
import cloneDeep from 'lodash/cloneDeep';
import { getRouterData, dynamicWrapper } from './common/router';
import { getPlainNode, getSession } from './utils/utils';

import styles from './index.less';

const { ConnectedRouter } = routerRedux;

// 设置默认的加载组件
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function getRouteData(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = cloneDeep(navData.filter(item => item.layout === path)[0]);
  const nodeList = getPlainNode(route.children);
  return nodeList;
}

// 登录验证
function requireAuth(Layout, props, passProps) {
  // 模拟token失效时间
  const token = getSession('ACCESS_TOKEN');
  if (token) {
    return <Layout {...props} {...passProps} />;
  } else {
    return <Redirect to="/user/login" />;
  }
}

/**
 * 拿到不同模板之间的路由信息
 * @param {Array} navData  --路由信息
 * @param {String} templateName --模板名称
 * @return 不同组件的路由信息
 */
function getLayout(navData, templateName){
  // 如果找不到路由相同的信息,或者是一级菜单的，那么返回为空
  if (!navData.some(item=> item.layout === templateName) || !(navData.filter(item => item.layout === templateName)[0].children)) {
    return null;
  }
  const route = navData.filter(item => item.layout === templateName)[0];
  return {
    component: route.component,
    layout: route.layout,
    name: route.name,
    path: route.path,
  };
}

function RouterConfig ({ history, app}) {
  // 先拿到路由信息
  const navData = getRouterData(app);
  // UserLayout 为需要登录的模块，而BasicLayout 为不需登录的模块
  const UserLayout = getLayout(navData, 'UserLayout').component;
  const BasicLayout = getLayout(navData, 'BasicLayout').component;
  const loginComponent = dynamicWrapper(app, ['login'], () => import('../src/routes/User/Login'));
  // 取出不需要登录的模块
  const passProps = {
    app,
    navData: navData.filter((item) => {
      return item.layout !== 'UserLayout';
    }), // 剔除掉无需登录模块
    getRouteData: (path) => {
      return getRouteData(navData, path);
    },
  };
  // 不需要登录的模块
  const publicProps = {
    app,
    navData: navData.filter((item) => {
      return item.layout === 'UserLayout';
    }), // 剔除掉无需登录模块
    getRouteData: (path) => {
      return getRouteData(navData, path);
    },
  };

  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path='/user/login' exact component={loginComponent} />
          <Route path="/user" render={props => <UserLayout {...props} {...publicProps} />} />
          <Route path="/" render={props => requireAuth(BasicLayout, props, passProps)} />
          <Redirect exact from="/" to="/workpath" />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;

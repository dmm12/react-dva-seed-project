/**
 * 为了统一方便的管理路由和页面的关系，将配置信息统一抽离到 common/router.js 下，同时应用动态路由
 */
import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import { resolveRequire } from '../utils/utils';

// 检验model是否存在
const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// dynamic 函数包装框架
export const dynamicWrapper = (app, models, component) => {
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      return component().then(raw => {
        const Component = resolveRequire(raw);
        return props =>
          createElement(Component, {
            ...props,
          });
      });
    },
  });
};

// 路由定义
export const getRouterData = app => [
   {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
      layout: 'BasicLayout',
      path: '/',
      icon: 'workplace',
      name: '服务自助',
      children: [
        {
          name: 'workplace',
          icon: 'workplace',
          path: 'workplace',
          children: [
            {
              name: '个人信息',
              path: 'userInfo',
              component: dynamicWrapper(app, [], () => import('../routes/SelfHelpService/UserInfo')),
            },
            {
              name: '重置密码',
              path: 'resetPwd',
              component: dynamicWrapper(app, [], () => import('../routes/SelfHelpService/ResetPwd')),
            },
          ],
        },
      ],
    },
    {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
      path: '/user',
      layout: 'UserLayout',
      children: [
        {
          name: '账户',
          icon: 'user',
          path: 'user',
          children: [
            {
              name: '找回密码',
              path: 'backPwd',
              component: dynamicWrapper(app, ['login'], () => import('../routes/User/BackPwd')),
            },
            {
              name: 'userDemo',
              path: 'userDemo',
              component: dynamicWrapper(app, ['user/userInfoDemo'], () => import('../routes/User/UserInfoDemo')),
            },
          ],
        },
      ],
    },
];


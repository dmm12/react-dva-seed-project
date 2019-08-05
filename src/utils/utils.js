import Cookies from 'universal-cookie';
import { notification, message } from 'hzero-ui';
import { forIn, forEach, isRegExp, isEmpty, sortBy, uniq, isArray} from 'lodash';
import pathToRegexp from 'path-to-regexp';


export const ACCESS_TOKEN = 'access_token';

const cookies = new Cookies();

// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
export function urlToList(url) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => {
    return `/${urllist.slice(0, index + 1).join('/')}`;
  });
}

// 处理路由中的childern，且获取一级路由，没有compnent的为一级菜单，有的为二级菜单
export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

// todo 调整消息返回
export function getResponse(response, errorCallback) {
  if (response && response.failed === true) {
    if (errorCallback) {
      errorCallback(response);
    } else {
      const msg = {
        message: '操作失败',
        description: response.message,
      };
      switch (response.type) {
        case 'info':
          notification.info(msg);
          break;
        case 'warn':
          notification.warning(msg);
          break;
        case 'error':
        default:
          notification.error(msg);
          break;
      }
    }
  } else {
    return response;
  }
}
/* 解析查询参数
* @param {Object} params
* @returns {Object} 解析后的查询参数
*/
export function parseParameters(params = {}) {
 const { page = {}, sort = {}, ...others } = params;
 const { current = 1, pageSize = 10 } = page;
 if (sort.order === 'ascend') {
   sort.order = 'asc';
 }
 if (sort.order === 'descend') {
   sort.order = 'desc';
 }
 const sortObj = {};
 if (!isEmpty(sort)) sortObj.sort = `${sort.field},${sort.order}`;
 let size = pageSize;
 const PAGE_SIZE_OPTIONS = 10;
 const sourceSize = [...PAGE_SIZE_OPTIONS];
 if (!sourceSize.includes(`${pageSize}`)) {
   const sizes = sortBy(uniq([...sourceSize, `${pageSize}`]), i => +i);
   const index = sizes.findIndex(item => +item === pageSize);
   size = +sizes[index - 1];
 }
 return {
   size,
   page: current - 1,
   ...others,
   ...sortObj,
 };
}


/**
 * 过滤掉对象值为 undefined 和 空字符串 和 空数组 的属性
 * @param {Object} obj
 * @returns {Object} 过滤后的查询参数
 */
export function filterNullValueObject(obj) {
  const result = {};
  if (obj && Object.keys(obj).length >= 1) {
    Object.keys(obj).forEach(key => {
      if (key && obj[key] !== undefined && obj[key] !== '' && obj[key] !== null) {
        // 如果查询的条件不为空
        if (isArray(obj[key]) && obj[key].length === 0) {
          return;
        }
        result[key] = obj[key];
      }
    });
  }
  return result; // 返回查询条件
}

export function getQueryString(name){
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const href = window.location.href.replace('&amp;', '&');
  const r = href.substring(href.indexOf('?') + 1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

/**
 * 抽取AccessToken
 * @param {String} hash   hash值
 */
export function extractAccessTokenFromHash(hash) {
  if (hash) {
    const ai = hash.indexOf(ACCESS_TOKEN);
    if (ai !== -1) {
      const accessTokenReg = /#?access_token=[0-9a-zA-Z-]*/g; // todo 确定 确定的 access_token 头, 现在看起来时 /#access_token
      hash.match(accessTokenReg);
      const centerReg = hash.match(accessTokenReg)[0];
      const accessToken = centerReg.split('=')[1];
      return accessToken;
    }
  }
  return null;
}

// 弹窗未完全关闭禁止再次提交
export function messageError(payload) {
  return new Promise((resolve) => {
    message.error(payload, () => {
      resolve(false);
    });
  });
}


function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}


function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * 存储sessionStorage
 */
export function setSession(key, value) {
  const formatValue = JSON.stringify(value);
  window.sessionStorage.setItem(key, formatValue);
  return true;
}

/**
 * 获取sessionStorage
 */
export function getSession(key) {
  const value = sessionStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return false;
}

/**
 * 获取 require('moduleName') 或者 import('moduleName') 的真正的导出对象
 * @param {object} module
 */
export function resolveRequire(module) {
  return module && module.__esModule ? module.default : module;
}

export function getAccessToken() {
  return cookies.get(ACCESS_TOKEN, {
    path: '/',
  });
}


export function setAccessToken(token) {
  cookies.set(ACCESS_TOKEN, token, {
    path: '/',
  });
}

export function removeAccessToken() {
  cookies.remove(ACCESS_TOKEN, {
    path: '/',
  });
}

export function removeAllCookie() {
  forIn(cookies.getAll(), (value, key) => {
    cookies.remove(key);
  });
}

export function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}
/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {String} path
 * @param {Object} [routerData={}]
 */
export function getRoutesContainsSelf(path, routerData = {}) {
  const routes = [];
  // 匹配到的 路由的 path。相当于 match.path
  let routerPath = '';
  // 匹配到的 路由的 path 的 开始正则。
  // 用来找到 当前 path 的路由 和 所有子路由
  let routerPathRegexpStart;
  forEach(routerData, (route, routePath) => {
    if (isRegExp(routerPathRegexpStart)) {
      // 找到 router 下 path 对应路由 及 他的所有子路由
      if (routerPathRegexpStart.test(routePath)) {
        routes.push(route);
      }
    } else if (route.pathRegexp.test(path)) {
      // 先找到 对应的 router 里面的 路由
      routes.push(route);
      routerPath = routePath;
      routerPathRegexpStart = pathToRegexp(routerPath, [], { end: false });
    }
  });
  // if(routerPathRegexpStart){
  //   // 对象遍历时 顺序时不确定的。
  //   lodash.forEach(routerData,(route,routePath)=>{
  //     // 找到 router 下 path 对应路由 及 他的所有子路由
  //     if(routerPathRegexpStart.test(routePath)){
  //       routes.push(route);
  //     }
  //   });
  // }
  // 所有匹配到的路由的 path
  let routePaths = [];
  forEach(routes, route => {
    routePaths.push(route.path);
  });
  routePaths = routePaths.map(item => item.replace(routerPath, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routePaths);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routePaths.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${routerPath}${item}`],
      key: `${routerPath}${item}`,
      path: `${routerPath}${item}`,
    };
  });
  return renderRoutes;
}

---
title: react-seed-project
date: 2019-8-5
tag: React dva
version: 1.0.0
---

# 开发指南

本项目是基于`React` `JavaScript`库以及轻量级前端框架`dva`, 并使用`roadhog`脚手架工具搭建的前端`demo`项目.

旨在帮助各位同事更加容易理解`React`前端项目,且大家可以根据此项目快速构建自己的`React`项目.

* [介绍](##介绍)
* [使用](##使用)
* [使用规范](##使用规范)
* [Author](##Author)
* [Contributing](##Contributing)

## 介绍

### 关于React

React是用于构建用户界面的JavaScript库

更多请参考[React Github](https://github.com/facebook/react)或[React官网](https://reactjs.org/)

### 关于dva框架

dva是基于 redux、redux-saga 和 react-router 的轻量级前端框架。

请参考[dva Github](https://github.com/dvajs/dva)，相关问题可以在[dva Github issues](https://github.com/dvajs/dva/issues)咨询

### 关于roadhog

创建没有生成配置的React应用程序。

请参考[roadhog Github](https://github.com/sorrycc/roadhog)

## 使用

下面是关于本项目的使用说明

### 下载 Clone/Download

您可以在这个地址使用`git` `clone`或下载本项目

```shell
git clone https://code.choerodon.com.cn/middleware-hiam/self-service-front.git
cd react-seed-project
```

### 准备

**本项目必须使用yarn来安装依赖**
本项目的开发环境如下

```shell
node.js: v6.x+
yarn
```

> 关于`node.js`和`yarn`
> 更多请参考[node.js官网](https://nodejs.org/en/)以及[yarn官网](https://yarnpkg.com)

在本项目中使用了eslint语法检查工具，所以您需要全局安装`eslint`

```shell
npm install eslint -g
```
若您使用了vsCode软件进行开发，建议您安装ESlint插件

### 初始化 init

接下来您需要初始化安装本项目的node.js依赖包(`node_modules`)

```shell
yarn
```

### 开发 start

执行如下命令

```shell
yarn start
```

* **start 会设置几个环境变量, 您可以改变他们来适应自己的项目(因不知道后台地址，这一块暂未配置)**
* BASE_PATH: 部署在子目录时需要改变。 例如 部署在 /demo/ 下; 则该变量的值为 /demo/
* CLIENT_ID: 是hzero后端所需要的客户端参数
* BPM_HOST: 工作流的接口地址
* API_HOST: 请求接口的地址
* WEBSOCKET_HOST: websocket 地址
* HARD_SOURCE: 是否在编辑的时候缓存(之前会出现问题, 所以禁用了)

启动成功后，您可以在浏览器中，输入控制台中的地址即可，默认端口为8000，例如下地址即可

```url
http://localhost:8000/
```

### 编译 build

因为本项目是基于React的web app,您可以执行如下命令,编译生成(基于`webpack`)用于生产环境的静态资源文件

```shell
yarn build
```

最终静态文件会生成至如下目录

```shell
/dist
```

* **build 会设置几个环境变量, 您可以改变他们来适应自己的项目**
* **这里的环境变量 是先build 再替换的方法**
* BASE_PATH: 部署在子目录时需要改变。 例如 部署在 /demo/ 下; 则该变量的值为 /demo/
* CLIENT_ID: 是hzero后端所需要的客户端参数
* BPM_HOST: 工作流的接口地址
* API_HOST: 请求接口的地址
* WEBSOCKET_HOST: websocket 地址
* ESLINT: 由于在提交的时候已经校验过了 所以这里不执行校验以提升打包速度
* PLATFORM_VERSION: 系统是OP版还是SAAS版

* **本地build后需要替换掉一些变量**
* BUILD_BASE_PATH
* BUILD_API_HOST
* BUILD_CLIENT_ID
* BUILD_BPM_HOST
* BUILD_WEBSOCKET_HOST
* BUILD_PLATFORM_VERSION

* **docker build 会执行 ./docker/enterpoint.sh 中的脚本, 需要设置环境变量**
* BUILD_BASE_PATH
* BUILD_API_HOST
* BUILD_CLIENT_ID
* BUILD_BPM_HOST
* BUILD_WEBSOCKET_HOST
* BUILD_PLATFORM_VERSION


## Author

邓婷敏(若有问题及时联系)

## Contributing

Clone

```shell
git clone https://code.choerodon.com.cn/middleware-hiam/self-service-front.git
cd hzero-platform-fe
```

Git global setup

```shell
git config --global user.name "yourname"
git config --global user.email "youremail@hand-china.com"
```

Commit & push

```shell
git add yourfile
git commit -m "your commit message"
git push -u origin master
```

## Commit guide

本项目采用如下规则

```shell
[操作][:][空格][commit内容]
```

`[commit内容]`请详细填写具体的文件新增/修改/删除操作过程

例如

```shell
fix: 修复查询功能bug
```

* 操作标识符

```shell
fix：修复bug
update：更新文件
add：新增文件
modify：重命名
delete：删除文件

```

### 目录

```shell
├── README.md
├── package.json
├── public
│   └── favicon.png
├── src
│   ├── assets
│   │   └── img
│   │   └── svg
│   │   └── logo.svg
│   ├── common
│   │   ├── config.js
│   │   ├── menuDate.js
│   │   └── router.js
│   ├── components
│   │   ├── SiderMenu
│   │   ├── _utils
│   ├── index.ejs
│   ├── index.js
│   ├── index.less
│   ├── layouts
|   |——  DefaultCommonSelect
|   |——  DefaultHeaderSearch
|   |——  DefaultRoleSelect
|   |——  TopLayout
|   |——  BasicLayout.js
|   |——  BasicLayout.less
|   |——  UserLayout.js
|   |——  UserLayout.less
│   ├── models
│   │   ├── global.js
│   │   ├── login.js
│   │   ├── user.js
│   ├── router.js
│   ├── routes
│   │   ├── SelfHelpService
│   │   ├── User
│   │   ├── Exception
│   ├── services
│   │   ├── api.js
│   │   ├── login.js
│   │   └── user.js
│   └── utils
│       ├── constant.js
│       ├── cookie.js
│       ├── request.js
│       ├── request.js
│       ├── utils.js
└── yarn.lock
```

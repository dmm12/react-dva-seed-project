
// 路由定义
export const menuDatas = [
  {
     layout: 'BasicLayout',
     path: '/',
     name: '服务自助',
     id: 1,
     code: 'ffzz',
     parentId: 0,
     type: 'root',
     sort: 1,
     icon: 'setting',
     route: '/',
     objectVersionNumber: 1,
     children: [
       {
         name: '已登录情况',
         icon: 'workplace',
         path: 'workplace',
         children: [
           {
             name: '个人信息',
             path: 'userInfo',
             id: 11,
             code: 'ffzz',
             parentId: 1,
             type: 'children',
             sort: 1,
             icon: 'setting',
             route: 'userInfo',
             objectVersionNumber: 1,
           },
           {
             name: '重置密码',
             path: 'resetPwd',
             id: 12,
             code: 'ffzz',
             parentId: 1,
             type: 'children',
             sort: 2,
             icon: 'area-chart',
             route: 'userInfo',
             objectVersionNumber: 1,
           },
         ],
       },
     ],
   },
   {
     path: '/user',
     layout: 'UserLayout',
     name: '服务自助',
     id: 1,
     code: 'ffzz',
     parentId: 0,
     type: 'root',
     sort: 1,
     icon: 'setting',
     route: '/user',
     objectVersionNumber: 1,
     children: [
       {
         name: '未登录情况',
         icon: 'user',
         path: 'user',
         children: [
           {
             name: '找回密码',
             path: 'backPwd',
             id: 12,
             code: 'ffzz',
             parentId: 1,
             type: 'children',
             sort: 2,
             icon: 'area-chart',
             route: 'user',
             objectVersionNumber: 1,
           },
         ],
       },
     ],
   },
];


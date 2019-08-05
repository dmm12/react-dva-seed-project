export default {
  [`POST /api/user/login`](req, res) {
    res.json({
      status: req.username == 'hand' ?
      'ok' : 'error',
      type: 'login',
      token: '666666'
     });
  },
  'GET /api/users': [{
    userId:1,
    contactName:"三三",
    mobile: "13476754575",
    email: "123@qq.com",
    address: "新街",
    defaultFlag: 1
  }, {
    userId:1,
    contactName:"三三",
    mobile: "13476754575",
    email: "123@qq.com",
    address: "新街",
    defaultFlag: 1
  }],
};


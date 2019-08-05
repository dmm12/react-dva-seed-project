export default {
  [`POST /api/user/login`](req, res) {
    res.json({
      status: req.username == 'hand' ?
      'ok' : 'error',
      type: 'login',
      token: '666666'
     });
  },
};

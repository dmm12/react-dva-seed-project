/** 这里存放服务自助的首页 */
import React from 'react';
import { Avatar } from 'hzero-ui';
import { connect } from 'dva';

function DashBoard({ login }) {
  // const handleClick = () => { }

  return (
    <div>
      <h1>这里是首页</h1>
      <p><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />当前用户是：{JSON.stringify(login.roles)}</p>
    </div>
  );
}

function mapStateToProps({ login }) {
  return { login };
}

export default connect(mapStateToProps)(DashBoard);

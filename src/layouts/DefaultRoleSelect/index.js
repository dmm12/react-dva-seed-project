/**
 * 角色切换
 */
import React, { PureComponent } from 'react';
import { Icon, Menu, Dropdown, Avatar } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { find } from 'lodash';
import { Bind } from 'lodash-decorators';

import { cleanMenuTabs } from 'utils/menuTab';

import styles from './index.less';
import defaultUserAvatar from '../../assets/logo-usercenter-default.png';

class DefaultRoleSelect extends PureComponent {
  state = {
    userAvatar: defaultUserAvatar,
  };

  componentDidUpdate(prevProps) {
    const { user: { currentUser: { imageUrl: prevUserAvatar } = {} } } = prevProps;
    const { user: { currentUser: { imageUrl: nextUserAvatar } = {} } } = this.props;
    if (prevUserAvatar !== nextUserAvatar) {
      // 只有当 用户头像存在 才会设置 用户头像
      if (nextUserAvatar) {
        const img = new Image();
        img.onload = this.updateUserAvatar;
        img.onerror = this.setDefaultUserAvatar;
        img.src = nextUserAvatar;
      }
    }
  }

  @Bind()
  onClick({ key }) {
    const { user = {}, updateCurrentRole, updateCurrentUser, gotoTab } = this.props;
    const { roleList = [] } = user;
    const newDefaultRole = find(roleList, o => o.id === Number(key)) || {};
    const { id, name } = newDefaultRole;
    updateCurrentRole({ roleId: id }).then(res => {
      if (!(res && res.failed)) {
        updateCurrentUser({
          currentRoleId: id,
          currentRoleName: name,
        });
        // 切换到 工作台
        // warn 清空 tabs 信息
        cleanMenuTabs();
        gotoTab({ pathname: '/' });
        window.location.reload();
      }
    });
  }

  @Bind()
  updateUserAvatar() {
    const { user: { currentUser: { imageUrl: nextUserAvatar } = {} } } = this.props;
    this.setState({
      userAvatar: nextUserAvatar,
    });
  }

  @Bind()
  setDefaultUserAvatar() {
    this.setState({
      userAvatar: defaultUserAvatar,
    });
  }

  render() {
    const { user = {} } = this.props;
    const { userAvatar } = this.state;
    const { roleList = [] } = user;
    const menu = (
      <Menu onClick={this.onClick}>
        {roleList.map(n => (
          <Menu.Item key={n.id}>
            {/* <Icon type="user" style={{ marginRight: 8 }} /> */}
            {n.name}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
        <span className={styles['select-role']}>
          <Avatar size="small" className={styles.avatar} src={userAvatar} />
          <Icon type="down" />
        </span>
      </Dropdown>
    );
  }
}

export default connect(
  ({ user = {} }) => ({
    user,
  }),
  dispatch => ({
    fetchRoleList: payload => {
      return dispatch({ type: 'user/fetchRoleList', payload });
    },
    // 更新当前角色(调接口)
    updateCurrentRole: payload => {
      return dispatch({
        type: 'user/updateCurrentRole',
        payload,
      });
    },
    // 更新用户信息
    updateCurrentUser: payload => {
      return dispatch({
        type: 'user/updateCurrentUser',
        payload,
      });
    },
    // 跳转到页面
    gotoTab: (location, state) => {
      return dispatch(routerRedux.push(location, state));
    },
  })
)(DefaultRoleSelect);

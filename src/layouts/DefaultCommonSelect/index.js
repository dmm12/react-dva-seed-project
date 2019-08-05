/**
 * 常用功能 集合
 * 租户切换/角色切换/个人中心/退出登录
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { routerRedux } from 'dva/router';
import { Icon, Avatar, Dropdown, Menu } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';

import { getSession, removeAccessToken } from 'utils/utils';

import { openTab } from 'utils/menuTab';

import DefaultRoleSelect from '../DefaultRoleSelect';

import styles from './styles.less';

import defaultUserAvatar from '../../assets/logo-usercenter-default.png';

class DefaultCommonSelect extends React.PureComponent {

  state = {
    dropdownVisible: false,
    userAvatar: defaultUserAvatar,
    token: getSession('ACCESS_TOKEN'),
  };
  componentDidMount() {
    // 由于是再个人中心数据加载完成后再加载的数据, 所以需要先设置 头像
    const { currentUser: { imageUrl: userAvatar } = {} } = this.props;
    if (userAvatar) {
      const img = new Image();
      img.onload = this.updateUserAvatar;
      img.onerror = this.setDefaultUserAvatar;
      img.src = userAvatar;
    }
  }

  componentDidUpdate(prevProps = {}) {
    const prevUserAvatar = prevProps.currentUser && prevProps.currentUser.imageUrl;
    const nextUserAvatar = this.props.currentUser && this.props.currentUser.imageUrl;
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
  updateUserAvatar() {
    const nextUserAvatar = this.props.currentUser && this.props.currentUser.imageUrl;
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

  handleMenuClick = ({ key }) => {
    const state = {
      token: this.state.token,
      dropdownVisible: true,
    };
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
      state.token = '';
      localStorage.accordLogin = 'false';
      removeAccessToken();
    }
    if (key === 'login') {
      localStorage.accordLogin = 'true';
      window.location.replace('/user/login');
    }

    if (key !== 'role') {
      state.dropdownVisible = false;
    }
    this.setState(state);
  };

  handleVisibleChange = flag => {
    this.setState({ dropdownVisible: flag });
  };

  render() {
    const { currentUser ={}} = this.props;
    const { userAvatar } = this.state;
    const dropdownMenu = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this.handleMenuClick}
        forceSubMenuRender
      >
        <Menu.Item key="role">
          <DefaultRoleSelect />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a
            href="#/hiam/user/info"
            onClick={e => {
              if (isFunction(e && e.preventDefault)) {
                e.preventDefault();
              }
              openTab({
                title: 'hzero.common.title.userInfo',
                key: '/hiam/user',
                path: '/hiam/user/info',
                icon: 'user',
                closable: true,
              });
            }}
          >
            <Icon type="user" />
            个人中心
          </a>
        </Menu.Item>
        <Menu.Item key={this.state.token && localStorage.accordLogin === 'true'? 'logout' : 'login'}>
          {this.state.token && localStorage.accordLogin === 'true'? '退出登录' : '登录'}
        </Menu.Item>
      </Menu>
    );
    return (
      <React.Fragment>
        <Dropdown
          forceRender
          overlay={dropdownMenu}
          trigger={['click']}
          onVisibleChange={this.handleVisibleChange}
          visible={this.state.dropdownVisible}
        >
          <span
            className={
              this.state.dropdownVisible
                ? `${styles['dropdown-open']} ${styles.account}`
                : `${styles.action} ${styles.account}`
            }
          >
            <Avatar size="small" className={styles.avatar} src={userAvatar} />
            <span className={styles.name}>
              {currentUser.currentRoleName ? currentUser.currentRoleName:''} <Icon type="down" />
            </span>
          </span>
        </Dropdown>
      </React.Fragment>
    );
  }
}

export default withRouter(
  connect(({ user = {} }) => ({
    currentUser: user.currentUser,
  }))(DefaultCommonSelect)
);

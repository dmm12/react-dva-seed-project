import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'hzero-ui';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Debounce from 'lodash-decorators/debounce';
import TopLayout from '../layouts/TopLayout';
import { menuDatas } from '../common/menuDate';
import Search from './DefaultHeaderSearch';
import styles from './BasicLayout.less';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    this.menus = menuDatas.filter(item => item.layout === 'UserLayout').reduce((arr, current) => arr.concat(current.children), []);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }
  getChildContext() {
    const { location, navData, getRouteData } = this.props;
    const routeData = getRouteData('UserLayout');
    const firstMenuData = navData.reduce((arr, current) => arr.concat(current.children), []);
    const menuData = this.getMenuData(firstMenuData, '');
    const breadcrumbNameMap = {};

    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = item.name;
    });
    return { location, breadcrumbNameMap };
  }
  componentDidMount() {
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }
  getMenuData = (data, parentPath) => {
    let arr = [];
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name });
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`));
      }
    });
    return arr;
  }
  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    // eslint-disable-line
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return ['workplace'];
    }
    return currentMenuSelectedKeys;
  }
  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    return keys;
  }
  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.key || item.path} className={styles['basic-menu-item']}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </a>
            ) : (
              <Link
                to={itemPath}
                target={item.target}
                replace={itemPath === this.props.location.pathname}
              >
                {icon}<span>{item.name}</span>
              </Link>
            )
          }
        </Menu.Item>
      );
    });
  }
  getPageTitle() { // 获取页面标题
    const { location, getRouteData } = this.props;
    const { pathname } = location;
    let title = 'React Antd Dva';
    getRouteData('UserLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name}`;
      }
    });
    return title;
  }
  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.menus.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  }

  toggle = () => {
    const { collapsed } = this.props;
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  render() {
    const { getRouteData, collapsed } = this.props;
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
    };
    const layout = (
      <Layout className={styles['basic-layout']}>
        <Header className={styles['basic-header']}>
          <TopLayout />
        </Header>
        <Layout className={styles['menu-content']}>
          <Sider
            collapsible
            breakpoint="md"
            className={collapsed ? `${styles['basic-sider']} ${styles.collapsed}` : styles['basic-sider']}
            collapsed={collapsed}
            onCollapse={this.onCollapse}
          >
            <Search />
            <Menu
              theme="dark"
              mode="inline"
              {...menuProps}
              onOpenChange={this.handleOpenChange}
              selectedKeys={this.getCurrentMenuSelectedKeys()}
              className={collapsed ? `${styles['basic-menu']} ${styles.collapsed}` : styles['basic-menu']}
            >
              {this.getNavMenuItems(this.menus)}
            </Menu>
          </Sider>
          <Content className={styles['basic-content']}>
            <div style={{ minHeight: 'calc(100vh - 256px)', background: '#fff' }}>
              <Switch>
                {
                  getRouteData('UserLayout').map(item =>
                    (
                      <Route
                        exact={item.exact}
                        key={item.path}
                        path={item.path}
                        component={item.component}
                      />
                    )
                  )
                }
                <Redirect exact from="/" to="/workplace" />
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  collapsed: state.global.collapsed,
}))(BasicLayout);

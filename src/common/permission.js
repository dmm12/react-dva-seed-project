import React from 'react';
// import { connect } from 'dva';
import { Route, Switch, Redirect, Link } from 'dva/router';
import { Menu, Icon } from 'hzero-ui';
import ProtectedRoute from './ProtectedRoute';
import { getMenuData } from './config';

const { Item: MenuItem, SubMenu } = Menu;

export const hasPermission = (userRoles, allowedRoles) => {
  if (!userRoles) return false;
  if (!allowedRoles || userRoles.includes('admin')) return true;
  return userRoles.some(role => allowedRoles.includes(role));
};

function LayoutContentRoutes() {
  const routes = [];
  const handleRoute = ({ redirect, path, children = [], roles, ...rest }, index) => {
    if (redirect) {
      routes.push(<Redirect key={path + index} from={path} to={redirect} {...rest} />);
      return;
    }
    if (children.length === 0) {
      routes.push(roles ?
        <ProtectedRoute key={path + index} path={path} routeRoles={roles} {...rest} /> :
        <Route key={path + index} path={path} {...rest} />);
      return;
    }
    children.forEach(handleRoute);
  };

   getMenuData.forEach(handleRoute);

  return (
    <Switch>
      {routes}
    </Switch>
  );
}

// WTF?
// export default connect(({ login }) => ({ login }))(LayoutContentRoutes)
export default LayoutContentRoutes;

const route2Menu = ({ path, redirect, subRoutes = [], title, roles, icon = "question-circle-o" }, index) => {
  if (redirect || !title || !hasPermission(window.store.roles, roles)) {
    return null;
  }
  return (
    subRoutes.length ? (
      <SubMenu
        key={path + index}
        title={<span><Icon type={icon} /><span>{title}</span></span>}
      >
        {subRoutes.map(route2Menu)}
      </SubMenu>
): (
  <MenuItem key={path}>
    {/* todo key和props的key重复? */}
    <Link to={path}><Icon type={icon} /><span>{title}</span></Link>
  </MenuItem>
));
};

export const Menus = ({ theme, mode, selectedKeys }) => (
  <Menu theme={theme} mode={mode} defaultSelectedKeys={selectedKeys}>
    {getMenuData.map(route2Menu)}
  </Menu>
);

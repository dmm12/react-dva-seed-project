/**
 * layout-通用布局-头部
 * @date: 2019-07-31
 * @author: DTM
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import DefaultCommonSelect from '../DefaultCommonSelect';
import style from './index.less';

@connect()
export default class TopLayout extends React.Component{
  state = {
    visible: false,
  };

  @Bind()
  handleMenuClick(){
    const { visible } = this.state;
    this.setState({ visible: !visible });
  }

  @Bind()
  handleVisibleChange(flag) {
    this.setState({ visible: !flag });
  }

  render(){
    const { onHandleLoginOut } = this.props;
    return (
      <div className={style['top-content']}>
        <div className={style['main-title']}>
          <Icon type="github" style={{paddingRight: '10px'}} />统一身份认证自助服务平台
        </div>
        <div className={style.fr}>
          <DefaultCommonSelect key="common-switch" LoginOut={onHandleLoginOut} />
        </div>
      </div>
    );};
}

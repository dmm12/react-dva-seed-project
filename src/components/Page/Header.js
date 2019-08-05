/**
 * 工作区 Header
 * 页面中的头部
 * @date: 2019-8-6
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Tooltip, Icon, Modal } from 'hzero-ui';
import { split, isString } from 'lodash';

@withRouter
export default class PageHeader extends Component {
  onBackBtnClick = () => {
    const { backPath, history, isChange } = this.props;
    if (isString(backPath)) {
      if (isChange) {
        Modal.confirm({
          title: '你有修改未保存，是否确认离开？',
          onOk: () => {
            this.linkToChange(this.props.backPath);
          },
        });
      } else {
        this.linkToChange(this.props.backPath);
      }
    } else {
      history.goBack();
    }
  };

  linkToChange = url => {
    const { history } = this.props;
    // const newUrl = `${url}${url.indexOf('?') === -1 ? '?' : '&'}_back=1`;
    // history.push(newUrl);
    const [pathname, search] = split(url, '?');
    history.push({
      pathname,
      search,
      state: {
        _back: -1,
      },
    });
  };
  render() {
    const { title, backPath, backTooltip = '返回', children } = this.props;
    let backBtn = '';
    if (backPath) {
      backBtn = (
        <div key="page-head-back-btn" className="page-head-back-btn">
          <Tooltip title={backTooltip} placement="bottom" getTooltipContainer={that => that}>
            <Icon type="arrow-left" className="back-btn" onClick={this.onBackBtnClick} />
          </Tooltip>
        </div>
      );
    }
    return (
      <div className="page-head">
        {backBtn}
        {title && (
          <span key="page-head-title" className="page-head-title">
            {title}
          </span>
        )}
        <div key="page-head-operator" className="page-head-operator">
          {children}
        </div>
      </div>
    );
  }
}

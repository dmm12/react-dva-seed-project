import React from 'react';
import PropTypes from 'prop-types';
import { Bind } from 'lodash-decorators';
import { Tag } from 'hzero-ui';

import styles from './styles.less';

export default class HistoryItem extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 通过搜索历史 跳转页面
   */
  @Bind()
  handleHistoryItemClick() {
    const { onClick, item } = this.props;
    onClick(item);
  }

  /**
   * 清除一个历史记录
   * @param {object} tab
   */
  @Bind()
  handleHistoryClose() {
    const { item, onCloseClick } = this.props;
    onCloseClick(item);
  }

  render() {
    const { item } = this.props;
    return (
      <Tag
        className={styles['history-item']}
        closable
        onClick={this.handleHistoryItemClick}
        afterClose={this.handleHistoryClose}
      >
        {item.title ? item.title : ''}
      </Tag>
    );
  }
}

/**
 * 搜索框
 */
import React from 'react';
import { Button, Select } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty, uniqBy } from 'lodash';

import { openTab } from 'utils/menuTab';
import { setSession, getSession } from 'utils/utils';

import styles from './styles.less';
import HistoryItem from './HistoryItem';

const menuHistorySessionKey = 'menuHistoryKey';

class DefaultHeaderSearch extends React.Component {
  state = {
    data: [], // 根据输入框过滤出符合的值
    value: undefined, // 搜索框中的值
    history: getSession(menuHistorySessionKey) || [],
  };

  /**
   * 通过搜索历史 跳转页面
   * @param {object} tab - tab 信息
   */
  @Bind()
  handleGotoHistory(tab) {
    openTab(tab);
    this.addHistory(tab);
  }

  /**
   * 新增一个历史记录
   * @param {object} tab - tab 信息
   */
  addHistory(tab) {
    const { history = [] } = this.state;
    const newHistory = uniqBy([tab, ...history], t => t.key);
    if (newHistory.length > 8) {
      newHistory.pop();
    }
    setSession(menuHistorySessionKey, history);
    this.setState({
      history: newHistory,
    });
  }

  /**
   * 清除一个历史记录
   * @param {object} tab
   */
  @Bind()
  handleHistoryClose(tab) {
    const { history = [] } = this.state;
    this.setState({
      history: history.filter(t => t !== tab),
    });
  }

  /**
   * 清除历史记录
   */
  @Bind()
  handleHistoryClear() {
    this.setState({
      history: [],
    });
  }

  componentWillUnmount() {
    const { history = [] } = this.state;
    setSession(menuHistorySessionKey, history);
  }

  /**
   * 文本框变化时回调
   * @param {string} value - 填写的标题
   */
  @Bind()
  handleSearch(value) {
    const { menuLeafNode } = this.props;
    let newData = [];
    const searchValue = value.trim().toLowerCase();
    if (searchValue) {
      newData = menuLeafNode.filter(item => {
        if (item && item.title && item.title.toLowerCase().indexOf(searchValue) >= 0) {
          return true;
        }
        const quickIndex = item && item.quickIndex && item.quickIndex.toLowerCase();
        if (quickIndex && quickIndex.trim()) {
          return quickIndex
            .trim()
            .toLowerCase()
            .startsWith(searchValue);
        }
        return false;
      });
    }
    this.setState({
      data: newData,
    });
  }

  /**
   * 下拉框选择值时变化
   * @param {string} value - 选中菜单的路径
   */
  @Bind()
  handleSelect(value) {
    const { menuLeafNode } = this.props;
    // 必定选中 且只能选中一个
    const selectMenu = menuLeafNode.filter(item => item.id === value)[0];
    if (!isEmpty(selectMenu)) {
      const newTab = {
        icon: selectMenu.icon,
        title: selectMenu.name,
        key: selectMenu.path,
        path: selectMenu.path,
        closable: true,
        id: selectMenu.id,
      };
      openTab(newTab);
      this.addHistory(newTab);
      this.setState({
        data: [],
        value: undefined,
      });
    }
  }

  /**
   * 获取焦点
   */
  @Bind()
  handleFocus() {
    this.setState({
      focus: true,
    });
  }

  /**
   * 失去焦点
   */
  @Bind()
  handleBlur() {
    this.setState({
      focus: false,
      data: [],
      value: undefined,
    });
  }

  /**
   * 渲染搜索历史
   * @returns {Array|boolean|*}
   */
  renderHistory() {
    const { history = [] } = this.state;
    return (
      history &&
      history.length > 0 && (
        <div className={styles.history}>
          <span className={styles['history-title']}>
            搜索历史:
            <Button ghost onClick={this.handleHistoryClear} className={styles['btn-clear']}>
              清除
            </Button>
          </span>
          <div className={styles['history-content']}>
            {history &&
              history.filter(tab => (tab.title ? tab.title : '')).map(tab => {
                return (
                  <HistoryItem
                    key={tab.key}
                    item={tab}
                    onClick={this.handleGotoHistory}
                    onCloseClick={this.handleHistoryClose}
                  />
                );
              })}
          </div>
        </div>
      )
    );
  }

  render() {
    const { className = '', collapsed } = this.props;
    const { data = [], value, focus } = this.state;
    const options =
      data &&
      data.map(d => (
        <Select.Option key={d.id} value={d.id}>
          {d.title}
        </Select.Option>
      ));
    const wrapClassNames = [className, styles.search];
    const iconClassNames = [styles.icon];
    if (collapsed) {
      wrapClassNames.push(styles.collapsed);
    }
    if (focus) {
      wrapClassNames.push(styles.focus);
      iconClassNames.push(styles.active);
    }
    return (
      <div className={wrapClassNames.join(' ')}>
        <span className={iconClassNames.join(' ')} />
        <Select
          showSearch
          size="small"
          placeholder="菜单搜索"
          value={value}
          showArrow={false}
          className={styles.input}
          filterOption={false}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onSearch={this.handleSearch}
          onSelect={this.handleSelect}
        >
          {options}
        </Select>
        {this.renderHistory()}
      </div>
    );
  }
}

export default connect(({ global = {} }) => ({
  menuLeafNode: global.menuLeafNode,
  language: global.language,
}))(DefaultHeaderSearch);

/**
 * index -用户列表-列表页
 * @date: 2019-8-6
 * @author DTM <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Button, Table, Badge } from 'hzero-ui';

import { Header, Content } from 'components/Page';

import FormList from './FormList';

@connect(({ userInfoDemo }) => ({
  userInfoDemo,
}))
export default class EcAcquirerAddress extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfoDemo/fetchUserList',
    });
  }

  // 绑定表单ref
  @Bind()
  handleRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }
  /**
   * 查询
   */
  @Bind()
  fetchEcData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfoDemo/fetchUserList',
    });
  }

  /**
   * 新建
   */
  @Bind()
  handleCreateData() {
  }

  /**
   * 编辑
   */
  @Bind()
  handleEditData() {
  }

  /**
   * 取消
   */
  @Bind()
  handleCancel() {
  }
  render() {
    const {
      userInfoDemo: { list = {}, pagination = {} },
      loading,
    } = this.props;
    const columns = [
      {
        title: '联系人',
        width: 100,
        dataIndex: 'contactName',
      },
      {
        title: '手机',
        width: 120,
        dataIndex: 'mobile',
      },
      {
        title: '邮箱',
        width: 170,
        dataIndex: 'email',
      },
      {
        title: '详细地址',
        width: 150,
        dataIndex: 'address',
      },
      {
        title: '默认',
        width: 70,
        dataIndex: 'defaultFlag',
        render: (_, record) => (
          <Badge
            status={record.defaultFlag ? 'success' : 'error'}
            text={
              record.defaultFlag
                ? '是'
                : '否'
            }
          />
        ),
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        dataIndex: 'edit',
        render: (_, record) => {
          return (
            <a
              onClick={() => {
                this.handleEditData(record);
              }}
            >
            编辑
            </a>
          );
        },
      },
    ];
    const filterList = {
      onRef: this.handleRef,
      onFetchData: this.fetchEcData,
    };
    return (
      <React.Fragment>
        <Header title='用户信息列表' />
        <Content>
          <div className="table-list-search">
            <FormList {...filterList} />
          </div>
          <Button type="primary" icon="plus" onClick={this.handleCreateData} style={{marginBottom: '10px'}}>
            新建
          </Button>
          <Table
            pagination={pagination}
            columns={columns}
            loading={loading}
            scroll={{ x: 1301 }}
            bordered
            dataSource={list.content}
            rowKey="userId"
            onChange={page => this.fetchEcData(page)}
          />
        </Content>
      </React.Fragment>
    );
  }
}

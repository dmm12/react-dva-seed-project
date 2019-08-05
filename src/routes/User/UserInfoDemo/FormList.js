/**
 * FormList -用户列表-列表页
 * @date: 2019-8-6
 * @author DTM <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Form, Button, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
@Form.create({ fieldNameProp: null })
export default class FormList extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }
  /**
   * 表单查询
   */
  // @Bind()
  // fetchEcAcquirerAddressList() {
  //   const { form, onFetchData } = this.props;
  //   form.validateFields((err, values) => {
  //     if (!err) {
  //       onFetchData({
  //         ...values,
  //       });
  //     }
  //   });
  // }

  /**
   * 表单重置
   */
  @Bind()
  reset() {
    const { form } = this.props;
    form.resetFields();
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form layout="inline" className="more-fields-form">
        <Row gutter={12}>
          <Col span={8}>
            <FormItem label='公司名称' {...formLayout}>
              {getFieldDecorator('companyName')(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='联系人' {...formLayout}>
              {getFieldDecorator('contactName')(<Input />)}
            </FormItem>
          </Col>
          <Col span={8} className="search-btn-more">
            <FormItem>
              <Button style={{ marginRight: 8 }} onClick={this.reset}>
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { Form, Input, Button, Icon, Spin } from 'hzero-ui';
import { setSession, getQueryString } from 'utils/utils';
import styles from './Login.less';


const FormItem = Form.Item;

@connect(state => ({
  login: state.login,
  messageStatus: state.global.messageStatus,
}))
@Form.create()

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSSO: true,
    };
  }

  // sso登录
// eslint-disable-next-line
 UNSAFE_componentWillMount() {
    const { history } = this.props;
    const accessToken = getQueryString('ACCESS_TOKEN');
    const logoutUrl = getQueryString('logout_url');
    if (accessToken !== null) { // 判断未登录时首页url地址是否携带token
      setSession('ACCESS_TOKEN', accessToken);
      localStorage.logoutUrl = logoutUrl;
      localStorage.isSsoLogin = 'true';
      history.replace('/');
    } else {
      localStorage.isSsoLogin = 'false';
      this.setState({
        isSSO: false,
      });
      if (localStorage.accordLogin === 'true') {
        history.replace('/user/login');
      } else {
        history.replace('/user');
      }
    }
  }


  @Bind()
  handleSubmit() {
    if (this.props.messageStatus) return; // 弹窗未完全关闭禁止再次提交
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: `login/accountSubmit`,
          payload: values,
        }).then(res => {
          if (res) {
            setSession('ACCESS_TOKEN', res.token);
            this.props.dispatch(routerRedux.push('/'));
          }
        });
      }
    });
  }

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className='login'>
        { this.state.isSSO ? (
          <Spin
            style={{
              marginTop: 300,
              display: 'inherit',
              marginLeft: '50%',
              marginRight: 'auto',
            }}
          />
        ): (
          <div className={styles['login-form']}>
            <div className={styles['login-logo']}>
              <img alt="" src="https://t.alipayobjects.com/images/rmsweb/T1B9hfXcdvXXXXXXXX.svg" />
              <span>hzero Design</span>
            </div>
            <Form>
              <FormItem>
                {getFieldDecorator('username', {
                        rules: [{
                          required: true,
                          message: '请输入用户名！',
                        }],
                      })(
                        <Input
                          prefix={<Icon type="user" className={styles.prefixIcon} />}
                          placeholder="随便"
                        />
                      )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: '请输入密码！',
                }],
              })(
                <Input
                  prefix={<Icon type="lock" className={styles.prefixIcon} />}
                  type="password"
                  placeholder="随便"
                />
              )}
              </FormItem>
              <FormItem className={styles.additional}>
                <Button
                  loading={login.submitting}
                  className={styles.submit}
                  type="primary"
                  onClick={()=>{this.handleSubmit();}}
                >
                登录
                </Button>
              </FormItem>
            </Form>
          </div>
        )}
      </div>
    );
  }
}

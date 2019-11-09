import React, { Component, ChangeEvent, SyntheticEvent } from 'react';
import axios from 'axios';
import { Button, Form, Input, Row, Col } from 'antd';
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGX, WEAK_PASSWORD_ERROR_MESSAGE } from '../../../validator/validator';
import * as Styled from '../../../styles';

interface IResetPasswordState {
  error?: string;
  message?: string;
  isButtonDisabled?: boolean;
  showAlert?: boolean;
  alertMessage?: string;
  newPassword?: string;
  confirmedPassword?: string;
}

class ResetPasswordForm extends Component<any, IResetPasswordState> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: '',
      message: '',
      isButtonDisabled: false
    };
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.state.showAlert !== prevState.showAlert) {
      setTimeout(() => {
        this.setState({ showAlert: false });
      }, 5000);
    }
  }

  handleSubmit = (e: SyntheticEvent) => {
    const { history } = this.props;
    e.preventDefault();
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        this.setState({
          isButtonDisabled: true
        });
        if (!values.newPassword || values.newPassword === '') {
          this.setState({
            error: 'Please type your new password',
            isButtonDisabled: false
          });
        } else if (values.newPassword !== values.confirmedPassword) {
          this.setState({
            error: 'Passwords do not match',
            isButtonDisabled: false
          });
        } else if (!PASSWORD_REGX.test(values.newPassword)) {
          this.setState({
            error: WEAK_PASSWORD_ERROR_MESSAGE,
            isButtonDisabled: false
          });
        } else if (!this.props.match.params.token || this.props.match.params.token === '') {
          this.setState({
            error: 'Password reset link is invalid',
            isButtonDisabled: false
          });
        } else {
          try {
            const res: any = await axios.post(`/auth/resetpassword`, {
              token: this.props.match.params.token,
              password: values.newPassword,
              confirmedPassword: values.confirmedPassword
            });
            this.setState({
              error: undefined,
              message: res.data.message
            });
            localStorage.setItem('authenticated', 'authenticated');
            history.push('/main');
          } catch (error) {
            if (
              !error.response ||
              error.response.status.toString().startsWith('5') ||
              error.response.status.toString() === '404'
            ) {
              this.setState({
                isButtonDisabled: false,
                alertMessage:
                  'System error! Please try again later or contact us at ' + process.env.REACT_APP_SUPPORT_EMAIL,
                showAlert: true
              });
            } else {
              this.setState({
                error: error.response.data.message,
                isButtonDisabled: false
              });
            }
          }
        }
      }
    });
  };

  onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPassword: event.target.value });
  };

  onChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ confirmedPassword: event.target.value });
  };

  validatePassword = (rule: any, value: string, callback: any) => {
    if (value && value !== '') {
      this.setState({
        error: undefined
      });
      callback();
      return;
    }
    this.setState({
      error: PASSWORD_ERROR_MESSAGE
    });
    callback('');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Styled.FullPageContainer>
        <Form onSubmit={this.handleSubmit} className='reset-password-form'>
          <Row>
            <Col
              span={24}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 30
              }}
              >
              <p style={{ 
                color: 'white', 
                margin: 'auto',
                textAlign: 'center',
                fontSize: Styled.fontSizeLg1,
                paddingBottom: 10
              }}>
                Reset Password
              </p>
            </Col>
          </Row>
          <Form.Item>
            <Row type='flex' justify='center' style={{ paddingTop: 10 }}>
              <Col
                span={24}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {getFieldDecorator('newPassword', {
                  rules: [{ validator: this.validatePassword }]
                })(
                  <Input
                    style={{ 
                      height: 40, 
                      width: 500, 
                      borderRadius: 0,
                      backgroundColor: 'transparent',
                      borderColor: 'white',
                      fontSize: Styled.fontSizeMd2,
                      color: 'white'
                    }}
                    placeholder='New Password*'
                    type='password'
                    onChange={this.onChangePassword}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Row type='flex' justify='center' style={{ paddingTop: 10 }}>
              <Col
                span={24}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {getFieldDecorator('confirmedPassword', {
                  rules: [{ validator: this.validatePassword }]
                })(
                  <Input
                    style={{ 
                      height: 40, 
                      width: 500, 
                      borderRadius: 0,
                      backgroundColor: 'transparent',
                      borderColor: 'white',
                      fontSize: Styled.fontSizeMd2,
                      color: 'white'
                    }}
                    placeholder='Confirm Password*'
                    type='password'
                    onChange={this.onChangeConfirmPassword}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            {this.state.error && (
              <Row>
                <Col
                  style={{
                    whiteSpace: 'pre-line',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <p style={{ color: 'red' }}>{this.state.error}</p>
                </Col>
              </Row>
            )}
            {this.state.message && (
              <Row>
                <Col
                  style={{
                    whiteSpace: 'pre-line',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <p style={{ color: 'black' }}>{this.state.message}</p>
                </Col>
              </Row>
            )}
            <Row type='flex' justify='center' style={{ paddingTop: 0 }}>
              <Col
                span={24}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Button
                  type='link'
                  htmlType='submit'
                  style={{
                    height: 64,
                    width: 500,
                    display: 'flex',
                    justifyContent: 'center',
                    borderRadius: 0,
                    color: 'white',
                    fontSize: Styled.fontSizeLg1,
                    fontWeight: 700,
                    letterSpacing: 3
                  }}
                  disabled={this.state.isButtonDisabled}
                >
                  RESET AND LOGIN
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Styled.FullPageContainer>
    );
  }
}

const ResetPassword = Form.create({ name: 'reset_password_form' })(ResetPasswordForm);
export { ResetPassword };
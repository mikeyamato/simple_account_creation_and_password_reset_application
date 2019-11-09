import React, { Component, ChangeEvent, SyntheticEvent } from 'react';
import axios from 'axios';
import { Button, Form, Input, Row, Col } from 'antd';
import { EMAIL_REGX, EMAIL_ERROR_MESSAGE } from '../../../validator/validator';
import * as Styled from '../../../styles';
import { RouteComponentProps } from 'react-router-dom';

interface IForgotPasswordState {
  error?: string;
  isButtonDisabled?: boolean;
  showAlert?: boolean;
  email?: string;
  alertMessage?: string;
}

interface IForgotPasswordProps extends RouteComponentProps {
  form?: any;
}

class ForgotPasswordForm extends Component<IForgotPasswordProps, IForgotPasswordState> {
  constructor(props: IForgotPasswordProps) {
    super(props);
    this.state = {
      error: '',
      isButtonDisabled: false,
      showAlert: false
    };
  }

  componentDidUpdate(prevProps: IForgotPasswordProps, prevState: any) {
    if (this.state.showAlert !== prevState.showAlert) {
      setTimeout(() => {
        this.setState({ showAlert: false });
      }, 5000);
    }
  }

  handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        this.setState({
          isButtonDisabled: true
        });
        if (!values.email || values.email === '') {
          this.setState({
            error: 'Please type your email',
            isButtonDisabled: false
          });
        } else {
          try {
            await axios.post(`/auth/forgotpassword`, {
              email: values.email
            });
            this.setState({
              error: undefined,
              isButtonDisabled: true,
              alertMessage: 'Password reset link sent! Please check your email.',
              showAlert: true
            });
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

  onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  validateEmail = (rule: any, value: string, callback: any) => {
    if (EMAIL_REGX.test(value.toLowerCase())) {
      this.setState({
        error: undefined
      });
      callback();
      return;
    }
    this.setState({
      error: EMAIL_ERROR_MESSAGE
    });
    callback('');
  };

  render() {
    const { isButtonDisabled, error } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Styled.FullPageContainer>
        <Form onSubmit={this.handleSubmit} className='forgot-password-form'>
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
                We'll send a password reset link to:
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
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: error, validator: this.validateEmail }]
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
                    placeholder='Email address*'
                    type='email'
                    onChange={this.onChangeEmail}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            {/* {this.state.error && (
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
            )} */}

            {isButtonDisabled ? 
              <Row>
                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <p style={{ 
                    color: 'white', 
                    margin: 'auto',
                    textAlign: 'center',
                    fontSize: Styled.fontSizeLg1,
                  }}>
                    Password reset link sent! Please check your email.
                  </p>
                </Col>
              </Row>
            :
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
                    SEND THE LINK
                  </Button>
                </Col>
              </Row>
            }

          </Form.Item>
        </Form>
      </Styled.FullPageContainer>
    );
  }
}

const ForgotPassword = Form.create({ name: 'forgot_password_form' })(ForgotPasswordForm);
export { ForgotPassword };
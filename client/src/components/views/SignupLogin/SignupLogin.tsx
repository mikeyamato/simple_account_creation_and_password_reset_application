import React, { Component, ChangeEvent, SyntheticEvent } from 'react';
import axios from 'axios';
import { Button, Form, Input, Row, Col } from 'antd';
import './SignupLogin.css';

import * as Styled from '../../../styles'

import {
  EMAIL_REGX,
  PASSWORD_REGX,
  EMAIL_ERROR_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
  WEAK_PASSWORD_ERROR_MESSAGE,
  NAME_ERROR_MESSAGE
} from '../../../validator/validator';

class SignupForm extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: '',
      errorEmail: '',
      errorName: '',
      isButtonDisabled: false,
      signup: true,
    };
  }

  handleSubmit = (e: SyntheticEvent) => {
    const { history } = this.props;
    const { signup } = this.state;
    e.preventDefault();
    this.props.form.validateFields(async (err: any, values: any) => {
      if (signup) {
        if (!err) {
          this.setState({
            isButtonDisabled: true
          });
          if (!values.email || values.email === '') {
            this.setState({
              errorEmail: 'Please type your email',
              isButtonDisabled: false
            });
          } else if (!values.password || values.password === '') {
            this.setState({
              error: 'Please type your password',
              isButtonDisabled: false
            });
          } else if (values.password !== values.confirmedPassword) {
            this.setState({
              error: 'Passwords do not match',
              isButtonDisabled: false
            });
          } else if (!PASSWORD_REGX.test(values.password)) {
            this.setState({
              error: WEAK_PASSWORD_ERROR_MESSAGE,
              isButtonDisabled: false
            });
          } else {
            try {
              await axios.post('/auth/signup', {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                confirmedPassword: values.confirmedPassword,
              });
              localStorage.setItem('authenticated', 'authenticated');
              history.push('/main');
            } catch (error) {
              this.setState({
                error: error.response.data.message,
                isButtonDisabled: false
              });
            }
          }
        }
      } else {
        if (!err) {
          this.setState({
            isButtonDisabled: true
          });
          if (!values.email || values.email === '') {
            this.setState({
              errorEmail: 'Please type your email',
              isButtonDisabled: false
            });
          } else if (!values.password || values.password === '') {
            this.setState({
              error: 'Please type your password',
              isButtonDisabled: false
            });
          } else if (!PASSWORD_REGX.test(values.password)) {
            this.setState({
              error: WEAK_PASSWORD_ERROR_MESSAGE,
              isButtonDisabled: false
            });
          } else {
            try {
              await axios.post('/auth/login', {
                email: values.email,
                password: values.password,
              });
              localStorage.setItem('authenticated', 'authenticated');
              history.push('/main');
            } catch (error) {
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

  onClickSignup = () => {
    this.setState({ signup: true, error: '', errorEmail: '' })
  }

  onClickLogin = () => {
    this.setState({ signup: false, error: '', errorEmail: '' })
  }

  onChangeFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ firstName: e.target.value });
  };

  onChangeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ lastName: e.target.value });
  };

  onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.target.value });
  };

  onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ confirmedPassword: e.target.value });
  };

  onClickForgotPassword = () => {
    this.props.history.push('/forgotpassword');
  }

  validateName = (rule: any, value: any, callback: any) => {
    if (value && value !== '') {
      this.setState({
        errorName: undefined
      });
      callback();
      return;
    }
    this.setState({
      errorName: NAME_ERROR_MESSAGE
    });
    callback('');
  };

  validateEmail = (rule: any, value: any, callback: any) => {
    if (EMAIL_REGX.test(value.toLowerCase())) {
      this.setState({
        errorEmail: undefined
      });
      callback();
      return;
    }
    this.setState({
      errorEmail: EMAIL_ERROR_MESSAGE
    });
    callback('');
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
    const { signup, isButtonDisabled, errorEmail, errorName } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} className='login-form'>

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
              <Button.Group >
                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                {signup ? 
                <Button 
                  type='link' 
                  onClick={this.onClickSignup}
                  style={{
                    height: 50,
                    width: 250,
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: 0,
                    fontSize: Styled.fontSizeMd2,
                  }}
                  >
                  Sign Up
                </Button>
                :
                  <Button 
                    className='selectButton'
                    type='link' 
                    onClick={this.onClickSignup}
                    style={{
                      height: 50,
                      width: 250,
                      display: 'flex',
                      justifyContent: 'center',
                      color: 'white',
                      borderRadius: 0,
                      fontSize: Styled.fontSizeMd2,
                    }}
                  >
                    Sign Up
                </Button>
                }
                {signup ? 
                  <Button 
                    className='selectButton'
                    type='link' 
                    onClick={this.onClickLogin}
                    style={{
                      height: 50,
                      width: 250,
                      display: 'flex',
                      justifyContent: 'center',
                      color: 'white',
                      borderRadius: 0,
                      fontSize: Styled.fontSizeMd2,
                    }}
                  >
                    Log In
                  </Button>
                :
                  <Button 
                    type='link' 
                    onClick={this.onClickLogin}
                    style={{
                      height: 50,
                      width: 250,
                      display: 'flex',
                      justifyContent: 'center',
                      color: 'white',
                      borderRadius: 0,
                      fontSize: Styled.fontSizeMd2,
                    }}
                  >
                    Log In
                  </Button>
                }
                </Col>
              </Button.Group>
            </Col>
        </Row>

        {signup ? 
          <div>
          <Row>
            <Col
              span={24}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              >
              <p style={{ 
                color: 'white', 
                margin: 'auto',
                textAlign: 'center',
                fontSize: Styled.fontSizeLg1,
                paddingTop: 30,
                paddingBottom: 30
              }}>
                Sign Up for Free
              </p>
            </Col>
          </Row>
          <Form.Item>
            <Row type='flex' justify='center' style={{ paddingTop: 0 }}>
              <Col
                span={24}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {getFieldDecorator('firstName', {
                  rules: [{ required: true, message: errorName, validator: this.validateName  }]
                })(
                  <Input
                    style={{ 
                      height: 40, 
                      width: 240, 
                      borderRadius: 0,
                      backgroundColor: 'transparent',
                      borderColor: 'white',
                      fontSize: Styled.fontSizeMd2,
                      marginRight: 10,
                      color: 'white'
                    }}
                    placeholder='First Name*'
                    type='firstName'
                    onChange={this.onChangeFirstName}
                  />
                )}

                {getFieldDecorator('lastName', {
                  rules: [{ required: true, message: errorName, validator: this.validateName }]
                })(
                  <Input
                    style={{ 
                      height: 40, 
                      width: 240, 
                      borderRadius: 0,
                      backgroundColor: 'transparent',
                      borderColor: 'white',
                      fontSize: Styled.fontSizeMd2,
                      marginLeft: 10,
                      color: 'white'
                    }}
                    placeholder='Last Name*'
                    type='lastName'
                    onChange={this.onChangeLastName}
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
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: errorEmail, validator: this.validateEmail }]
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
                    placeholder='Email Address*'
                    type='email'
                    onChange={this.onChangeEmail}
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
                {getFieldDecorator('password', {
                  rules: [{ required: true, validator: this.validatePassword }]
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
                    placeholder='Set A Password*'
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
                  rules: [{ required: true, validator: this.validatePassword }]
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
            <Row type='flex' justify='center' style={{ paddingTop: 10 }}>
              <Col
                span={24}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Button
                  disabled={isButtonDisabled}
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
                >
                  GET STARTED
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </div>
        :
        <div>
          <Row>
            <Col
              span={24}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              >
              <p style={{ 
                color: 'white', 
                margin: 'auto',
                textAlign: 'center',
                fontSize: Styled.fontSizeLg1,
                paddingTop: 30,
                paddingBottom: 30
              }}>
                Welcome Back!
              </p>
            </Col>
          </Row>
          <Form.Item>
            <Row type='flex' justify='center' style={{ paddingTop: 0 }}>
              <Col
                span={24}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: errorEmail, validator: this.validateEmail }]
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
            <Row type='flex' justify='center' style={{ paddingTop: 10 }}>
              <Col
                span={24}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true, validator: this.validatePassword }]
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
                    placeholder='Password*'
                    type='password'
                    onChange={this.onChangePassword}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
          <Row>
            <Col
              span={24}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p
                style={{ 
                  width: 500,
                  color: '#30a384', 
                  textAlign: 'end'
                }}
              >
                <span 
                  onClick={this.onClickForgotPassword} 
                  style={{ 
                    cursor: 'pointer',
                  }}
                >
                  Forgot Password?
                </span>
              </p>
            </Col>
          </Row>
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
                  disabled={isButtonDisabled}
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
                >
                  LOG IN
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </div>
        }

      </Form>
    );
  }
}

const SignupLogin = Form.create({ name: 'normal_signup' })(SignupForm);
export { SignupLogin };

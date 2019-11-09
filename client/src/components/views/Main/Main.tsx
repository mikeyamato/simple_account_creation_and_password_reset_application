import React, { Component, SyntheticEvent } from 'react'
import axios from 'axios';
import { Form, Button, Row, Col } from 'antd';

import * as Styled from '../../../styles'

export class Main extends Component<any, any> {
	constructor(props: any) {
    super(props);
    this.state = {
      isButtonDisabled: false
    };
  }

  handleSubmit = async (e: SyntheticEvent) => {
    const { history } = this.props;
		e.preventDefault();
		this.setState({
			isButtonDisabled: true
		});
		try {
			await axios.get('/auth/logout'); 
		} catch (error) {
			this.setState({
				isButtonDisabled: false
			});
			if (error.response.status === 500) {
        // @ts-ignore
				console.log('Logout failed.');
			}
		} finally {
			localStorage.removeItem('authenticated');
			history.push('/')
		}
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className='main'>
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
                Main page
              </p>
            </Col>
          </Row>
        <Form.Item>
          <Row type='flex' justify='center' style={{ paddingTop: 50 }}>
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
                Logout
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}

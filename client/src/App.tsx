import React, { Component } from 'react';
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';

import { AuthLayoutRoute } from './components/layout/AuthLayout';
import { AppLayoutRoute } from './components/layout/AppLayout';
import { SignupLogin } from './components/views/SignupLogin/SignupLogin';
import { Main } from './components/views/Main/Main';
import requireAuth from './components/auth/AuthenticatedComponent';
import { ForgotPassword } from './components/views/ForgotPassword/ForgotPassword';
import { ResetPassword } from './components/views/ResetPassword/ResetPassword';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {/* unprotected routes */}
          <AuthLayoutRoute exact={true} path='/' component={ SignupLogin } />
          <AuthLayoutRoute exact={true} path='/forgotpassword' component={ ForgotPassword } />
          <AuthLayoutRoute exact={true} path='/resetpassword/:token' component={ ResetPassword } />
          {/* protected route(s) after auth */}
          <AppLayoutRoute exact={true} path='/main' component={ requireAuth(Main) } />
          {/* any route hit but not listed */}
          <Route path='*'>
            <Redirect to='/' />
          </Route>
        </Switch>
      </Router>
    )
  }
}

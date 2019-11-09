import React from 'react';
import { withRouter } from 'react-router-dom';

export default function requireAuth(Component: any) {
  class AuthenticatedComponent extends React.Component<any, any> {
    componentDidMount() {
      this.checkAuth();
    }

    checkAuth() {
      if (!localStorage.getItem('authenticated')) {
        const location = this.props.location;
        const redirect = location.pathname + location.search;

        this.props.history.push(`/?redirect=${redirect}`);
      }
    }

    render() {
      return localStorage.getItem('authenticated') ? (
        <Component {...this.props} />
      ) : null;
    }
  }
  
  return withRouter(AuthenticatedComponent);
}
import React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import dotenv from 'dotenv';

dotenv.config();

interface IAuthLayoutProps {
  children: any;
}

export function AuthLayout(props: IAuthLayoutProps & RouteComponentProps) {
  return (
    <div style={{ height: '100vh', flexDirection: 'row' }}>
      {props.children}
    </div>
  );
}

const AuthLayoutWithRouter = withRouter(AuthLayout);

export function AuthLayoutRoute(props: any) {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      // tslint:disable-next-line:jsx-no-lambda
      render={(matchProps: any) => (
        <AuthLayoutWithRouter>
          <Component {...matchProps}/>
        </AuthLayoutWithRouter>
      )}
    />
  );
}
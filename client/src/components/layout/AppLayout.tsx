import React from 'react';
import { Route } from 'react-router-dom';

interface IAppLayoutProps {
  children: any;
}

export function AppLayout(props: IAppLayoutProps) {
  return (
    <div style={{ height: '100vh', flexDirection: 'row' }}>
      {props.children}
    </div>
  );
}

export function AppLayoutRoute(props: any) {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      // tslint:disable-next-line:jsx-no-lambda
      render={(matchProps: any) => (
        <AppLayout>
          <Component {...matchProps} />
        </AppLayout>
      )}
    />
  );
}
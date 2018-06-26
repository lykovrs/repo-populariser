import { ROUTE_LOGIN } from "./_constants";
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { isAuthenticatedSelector } from "../ducks/auth";

/**
 *  Декоратор приватной страницы
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.auth ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: ROUTE_LOGIN,
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default connect(state => ({
  auth: isAuthenticatedSelector(state)
}))(PrivateRoute);

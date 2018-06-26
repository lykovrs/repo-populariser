import React, { Component } from "react";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";

export const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red
  },
  status: {
    danger: "orange"
  }
});

/**
 *  Компонент Root, необходим для подключения стора
 */
class Root extends Component {
  static propTypes = {};

  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default Root;

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles/index";
import { connect } from "react-redux";
import { isAuthenticatedSelector, logIn } from "../ducks/auth";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import SendIcon from "@material-ui/icons/Send";

const styles = theme => ({
  root: {
    padding: "24px"
  },

  flex: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    flexBasis: 200
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  }
});

/**
 * Страница аутентификации
 */
class LoginPage extends Component {
  state = {
    redirectToReferrer: false,
    name: "",
    password: "",
    showPassword: false
  };

  render() {
    const { classes } = this.props;
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <Grid item xs={12}>
        <Paper elevation={4} className={classes.root}>
          <Typography variant="headline" component="h3">
            Вы должны войти в систему, чтобы просмотреть страницу по адресу
            {from.pathname}
          </Typography>
          <div className={classes.flex}>
            <FormControl
              className={classNames(classes.margin, classes.textField)}
            >
              <InputLabel htmlFor="input-with-icon-adornment">
                Имя пользователя
              </InputLabel>
              <Input
                id="input-with-icon-adornment"
                value={this.state.name}
                onChange={this.handleChange("name")}
                startAdornment={
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl
              className={classNames(classes.margin, classes.textField)}
            >
              <InputLabel htmlFor="adornment-password">Пароль</InputLabel>
              <Input
                id="adornment-password"
                type={this.state.showPassword ? "text" : "password"}
                value={this.state.password}
                onChange={this.handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button
              variant="fab"
              color="primary"
              className={classes.button}
              onClick={this.login}
            >
              <SendIcon />
            </Button>
          </div>
        </Paper>
      </Grid>
    );
  }

  /**
   * Запрашивает аутентификацию
   */
  login = () => {
    const { name, password } = this.state;
    this.setState({ redirectToReferrer: true });
    this.props.logIn(name, password);
  };

  /**
   * Фиксирует изменения в поле ввода
   * @param prop
   * @returns {Function}
   */
  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  /**
   * Клип по полю с паролем
   * @param event
   */
  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  /**
   *  Делает видимым пароль
   */
  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

LoginPage = withStyles(styles, { withTheme: true })(LoginPage);
LoginPage = connect(
  state => ({
    auth: isAuthenticatedSelector(state)
  }),
  { logIn }
)(LoginPage);

export default LoginPage;

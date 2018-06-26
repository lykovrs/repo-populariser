import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import logo from "../../logo.svg";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { connect } from "react-redux";
import {
  isAuthenticatedSelector,
  userSelector,
  logOut
} from "../../ducks/auth";
import { withRouter } from "react-router-dom";
import { ROUTE_PROFILE } from "../../router/_constants";

const styles = theme => ({
  flex: {
    flex: 1
  },
  logo: {
    marginLeft: -12,
    marginRight: 20,
    maxHeight: "40px",
    width: "40px"
  },
  menuButton: {
    marginRight: 20
  },
  logoLink: {
    fontSize: 0
  }
});

/**
 * Компонент шапки
 * @param props
 * @returns {*}
 * @constructor
 */
class Header extends Component {
  state = {
    anchorEl: null
  };

  render() {
    const { auth, classes, user } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <AppBar position="fixed">
        <Toolbar>
          <Link className={classes.logoLink} to="/">
            <img src={logo} className={classes.logo} alt="logo" />
          </Link>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Самые популярные репозитории на GitHub
          </Typography>

          {auth && (
            <div>
              <IconButton
                aria-owns={open ? "menu-appbar" : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.redirectToProfile}>Профиль</MenuItem>
                <MenuItem onClick={this.handleLogOut}>Выход</MenuItem>
              </Menu>
              {user.name}
            </div>
          )}
        </Toolbar>
      </AppBar>
    );
  }

  /**
   * Открывает меню
   * @param event
   */
  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  /**
   * Зарыает меню
   */
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  /**
   * Отправляет на страницу профиля
   */
  redirectToProfile = () => {
    const { history } = this.props;
    this.handleClose();
    history.push(ROUTE_PROFILE);
  };

  /**
   *  Разлогинивает пользователя
   */
  handleLogOut = () => {
    const { logOut, history } = this.props;
    this.handleClose();
    logOut();
    history.push("/");
  };
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  // reudux
  logOut: PropTypes.func.isRequired,
  auth: PropTypes.bool.isRequired
};
Header.defaultProps = {};

export default connect(
  state => ({
    auth: isAuthenticatedSelector(state),
    user: userSelector(state)
  }),
  {
    logOut
  }
)(withStyles(styles)(withRouter(Header)));

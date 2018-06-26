import React, { Component } from "react";
import ReactDom from "react-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4
  }
});

/**
 * Создает портал для нотификации сообщений
 */
class SimpleSnackbarPortal extends Component {
  state = {
    open: true
  };

  componentWillMount() {
    this.root = document.createElement("div");
    document.body.appendChild(this.root);
  }

  render() {
    const { classes, message } = this.props;
    return ReactDom.createPortal(
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </div>,
      this.root
    );
  }

  componentWillUnmount() {
    document.body.removeChild(this.root);
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
    if (this.props.callbackClose) {
      setTimeout(() => this.props.callbackClose(), 100);
    }
  };
}

SimpleSnackbarPortal.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  callbackClose: PropTypes.func.isRequired
};

export default withStyles(styles)(SimpleSnackbarPortal);

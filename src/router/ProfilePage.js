import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles/index";
import { connect } from "react-redux";
import { userSelector } from "../ducks/auth";

const styles = theme => ({
  root: {
    padding: "24px"
  }
});

/**
 * Страница пользователя
 */
class ProfilePage extends Component {
  render() {
    const { classes, user } = this.props;
    return (
      <Grid item xs={12}>
        <Paper elevation={4} className={classes.root}>
          <Typography variant="headline" component="h3">
            Профиль пользователя
          </Typography>

          <Typography variant="title" gutterBottom>
            Имя: {user.name}
          </Typography>
        </Paper>
      </Grid>
    );
  }
}

ProfilePage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

ProfilePage = withStyles(styles, { withTheme: true })(ProfilePage);
ProfilePage = connect(state => ({
  user: userSelector(state)
}))(ProfilePage);

export default ProfilePage;

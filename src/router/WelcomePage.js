import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles/index";
import { ROUTE_REPOSITORIES } from "./_constants";
import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    padding: "24px"
  }
});

/**
 * Страница приветствия
 */
function WelcomePage(props) {
  const { classes } = props;
  return (
    <Grid item xs={12}>
      <Paper elevation={4} className={classes.root}>
        <Typography variant="headline" component="h3">
          Добро пожаловать в сервис анализа самых популярных репозиториев на
          GitHub!
        </Typography>
        <Typography component="p">
          Чтобы начать анализ перейдите по{" "}
          <Link to={ROUTE_REPOSITORIES}>ссылке</Link>
        </Typography>
      </Paper>
    </Grid>
  );
}

WelcomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(WelcomePage);

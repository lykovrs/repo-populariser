import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles/index";

const styles = theme => ({
  root: {
    padding: "24px"
  }
});

/**
 * Страница не найдена
 */
function NoMatchPage(props) {
  const { classes, location } = props;
  return (
    <Grid item xs={12}>
      <Paper elevation={4}>
        <Typography className={classes.root} variant="headline" component="h3">
          Страницы по адресу <code>{location.pathname}</code> не существует
        </Typography>
      </Paper>
    </Grid>
  );
}

NoMatchPage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(NoMatchPage);

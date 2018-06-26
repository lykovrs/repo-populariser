import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles/index";
import { Link } from "react-router-dom";
import { ROUTE_ANALYSIS } from "./_constants";

const styles = theme => ({
  root: {
    padding: "24px"
  }
});

/**
 * Страница отчета
 */
function ReportPage(props) {
  const { classes } = props;
  return (
    <Grid item xs={12}>
      <Paper className={classes.root}>
        <Link to={ROUTE_ANALYSIS}>Перейти к странице анализа</Link>
      </Paper>
      {props.id}
      {/*<ReportTable id={props.id} />*/}
    </Grid>
  );
}

ReportPage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default withStyles(styles, { withTheme: true })(ReportPage);

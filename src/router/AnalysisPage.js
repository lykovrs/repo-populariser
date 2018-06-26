import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles/index";
import ReportTable from "../components/ReportTable";

const styles = theme => ({});

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 3 }}>
      {children}
    </Typography>
  );
}

/**
 * Страница Анализа
 */
class AnalysisPage extends Component {
  render() {
    const { classes, theme } = this.props;
    return (
      <Fragment>
        <Grid item xs={12}>
          <div className={classes.root}>
            <ReportTable />
          </div>
        </Grid>
      </Fragment>
    );
  }
}

AnalysisPage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(AnalysisPage);

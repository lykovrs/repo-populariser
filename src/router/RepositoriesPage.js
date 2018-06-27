import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles/index";
import RepositoriesTable from "../components/RepositoriesTable";
import FiltersPanel from "../components/FiltersPanel";

const styles = theme => ({});

/**
 * Страница Анализа
 */
class RepositoriesPage extends Component {
  render() {
    const { classes, theme } = this.props;
    return (
      <Fragment>
        <Grid item xs={12}>
          <FiltersPanel />
        </Grid>

        <Grid item xs={12}>
          <RepositoriesTable />
        </Grid>
      </Fragment>
    );
  }
}

RepositoriesPage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(RepositoriesPage);

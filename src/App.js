import React, { Component } from "react";
import Header from "./components/Header/index";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "./router/LoginPage";
import PrivateRoute from "./router/PrivateRoute";
import AnalysisPage from "./router/AnalysisPage";
import WelcomePage from "./router/WelcomePage";
import ReportPage from "./router/ReportPage";
import {
  ROUTE_LOGIN,
  ROUTE_ANALYSIS,
  ROUTE_PROFILE,
  ROUTE_REPORT
} from "./router/_constants";
import NoMatchPage from "./router/NoMatchPage";
import ProfilePage from "./router/ProfilePage";
import "dayjs/locale/ru";
import dayjs from "dayjs";

dayjs.locale("ru");

const styles = theme => ({
  "@global": {
    html: {
      background: "#eee"
    },
    body: {
      overflowX: "hidden",
      margin: 0,
      padding: 0,
      fontFamily: "sans-serif"
    }
  },
  app: {
    padding: "100px 20px 0",
    maxWidth: "1200px",
    margin: "0 auto"
  }
});

/**
 * App компонент
 */
class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Router>
        <div className={classes.app}>
          <Header />

          <Grid container spacing={40}>
            <Switch>
              <Route path="/" exact component={WelcomePage} />
              <Route path={ROUTE_LOGIN} exact component={LoginPage} />
              <PrivateRoute
                path={ROUTE_ANALYSIS}
                exact
                component={AnalysisPage}
              />
              <PrivateRoute
                path={`${ROUTE_ANALYSIS}${ROUTE_REPORT}/:id`}
                exact
                component={({ match }) => <ReportPage id={match.params.id} />}
              />
              <PrivateRoute
                path={ROUTE_PROFILE}
                exact
                component={ProfilePage}
              />
              <Route component={NoMatchPage} />
            </Switch>
          </Grid>
        </div>
      </Router>
    );
  }
}
export default withStyles(styles, { withTheme: true })(App);

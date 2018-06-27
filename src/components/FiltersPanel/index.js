import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  fetchRepositories,
  queryParamsSelector,
  reportLoadingSelector
} from "../../ducks/repositories";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

/**
 * Компронент панели фильтров
 */
class FiltersPanel extends Component {
  state = {
    fromDate: "",
    amount: ""
  };

  componentWillReceiveProps(nextProps) {
    const { amount, fromDate } = nextProps.queryParams;
    this.setState({
      amount,
      fromDate
    });
  }

  render() {
    const { classes, loading } = this.props;
    return (
      <form className={classes.container} noValidate>
        <FormControl className={classes.formControl}>
          <TextField
            disabled={loading}
            name="fromDate"
            label="Начиная с"
            type="date"
            value={this.state.fromDate}
            onChange={this.handleChange}
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="amount">Последние</InputLabel>
          <Select
            disabled={loading}
            value={this.state.amount}
            onChange={this.handleChange}
            inputProps={{
              name: "amount"
            }}
          >
            {this.getSelectItems()}
          </Select>
        </FormControl>
      </form>
    );
  }

  /**
   * Возвращает массив компонентов для селекта
   * @returns {any[]}
   */
  getSelectItems = () => {
    return [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(value => (
      <MenuItem key={value} value={value}>
        {value}
      </MenuItem>
    ));
  };

  /**
   * Актуализирует данные полей ввода в стейт
   * @param ev
   */
  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value }, this.sendDataServer);
  };

  /**
   * Отправлят данные
   */
  sendDataServer = () => {
    const { amount, fromDate } = this.state;
    this.props.fetchRepositories(fromDate, amount);
  };
}

FiltersPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  //redux
  loading: PropTypes.bool.isRequired,
  queryParams: PropTypes.object.isRequired,
  fetchRepositories: PropTypes.func.isRequired
};

export default connect(
  state => ({
    loading: reportLoadingSelector(state),
    queryParams: queryParamsSelector(state)
  }),
  {
    fetchRepositories
  }
)(withStyles(styles, { withTheme: true })(FiltersPanel));

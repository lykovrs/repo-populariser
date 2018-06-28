import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import RepositoriesTableHead from "./head";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { connect } from "react-redux";
import {
  clearRepositoriesMessage,
  fetchRepositories,
  reportMessagesSelector,
  reportItemsSelector,
  reportLoadingSelector
} from "../../ducks/repositories";
import LinearProgress from "@material-ui/core/LinearProgress";
import SimpleSnackbarPortal from "../SimpleSnackbarPortal";
import dayjs from "dayjs";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const styles = theme => ({
  root: {
    width: "100%"
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  },
  button: {
    margin: theme.spacing.unit
  },
  loader: {
    height: "5px"
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  formControl: {
    marginLeft: theme.spacing.unit,
    minWidth: "200px"
  }
});

/**
 * Компонент RepositoriesTable с таблицей отчета
 */
class RepositoriesTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: "asc",
      orderBy: "stargazers",
      data: [],
      page: 0,
      rowsPerPage: 5,
      filter: ""
    };
  }

  render() {
    const { classes, loading, messages } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <Toolbar>
          <Typography variant="title" gutterBottom>
            Отчет
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="name-filter">
                Фильтровать по имени
              </InputLabel>
              <Input
                onChange={this.filterByText}
                value={this.state.filter}
                id="name-filter"
              />
            </FormControl>
          </Typography>
        </Toolbar>
        <div className={classes.loader}>
          {loading ? <LinearProgress variant="query" /> : ""}
        </div>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <RepositoriesTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return (
                    <TableRow
                      className={"test-row-report-items"}
                      hover
                      tabIndex={-1}
                      key={n.id}
                    >
                      <TableCell>{n.name}</TableCell>
                      <TableCell>{n.description}</TableCell>
                      <TableCell numeric>{n.stargazers}</TableCell>
                      <TableCell numeric>{n.forks}</TableCell>
                      <TableCell>{n.updatedAt}</TableCell>
                      <TableCell>{n.createdAt}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          labelRowsPerPage={"строк на странице"}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        {messages.map((message, i) => (
          <SimpleSnackbarPortal
            key={i}
            message={message}
            callbackClose={this.clearMessage(message)}
          />
        ))}
      </Paper>
    );
  }

  /**
   * Делаем запрос данных
   */
  componentDidMount() {
    const monthAgo = dayjs()
      .add(-1, "month")
      .format("YYYY-MM-DD");

    this.props.fetchRepositories(monthAgo, 10);
  }

  /**
   * Метод жизненного цикла, при обновлении props записывает объекты в состояние
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.items
    });
  }

  /**
   * Обработчик сортировки
   * @param event
   * @param property
   */
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    const data =
      order === "desc"
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  /**
   * Переключает страницы
   * @param event
   * @param page
   */
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  /**
   * Переключает колличество просматриваемых записей
   * @param event
   */
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  /**
   * Очищаем отработанное сообщение
   * @param message
   * @returns {Function}
   */
  clearMessage = message => () => {
    this.props.clearRepositoriesMessage(message);
  };

  /**
   * Фильтрация строк по содержанию подстроки в имени
   * @param ev
   */
  filterByText = ev => {
    const text = ev.target.value;
    const filteredData = this.props.items.filter(
      item => item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
    );
    this.setState({ data: filteredData, filter: text });
  };
}

RepositoriesTable.propTypes = {
  classes: PropTypes.object.isRequired,
  //redux
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  messages: PropTypes.array.isRequired,
  clearRepositoriesMessage: PropTypes.func.isRequired,
  fetchRepositories: PropTypes.func.isRequired
};

export default connect(
  state => ({
    items: reportItemsSelector(state),
    loading: reportLoadingSelector(state),
    messages: reportMessagesSelector(state)
  }),
  {
    clearRepositoriesMessage,
    fetchRepositories
  }
)(withStyles(styles, { withTheme: true })(RepositoriesTable));

import React, { Component } from "react";
import PropTypes from "prop-types";
import TableHead from "@material-ui/core/TableHead";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

// описание данных в колонках
const columnData = [
  { id: "name", numeric: false, disablePadding: false, label: "Имя" },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Описание"
  },

  { id: "stargazers", numeric: true, disablePadding: false, label: "Звезды" },
  { id: "forks", numeric: true, disablePadding: false, label: "Форки" },
  { id: "updatedAt", numeric: false, disablePadding: false, label: "Обновлен" },
  { id: "createdAt", numeric: false, disablePadding: false, label: "Создан" }
];

/**
 * Шапка таблицы
 */
class RepositoriesTableHead extends Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columnData.map(column => {
            if (column.id === "raw" || column.id === "report") {
              return (
                <TableCell key={column.id} numeric={column.numeric}>
                  {column.label}
                </TableCell>
              );
            } else {
              return (
                <TableCell
                  key={column.id}
                  numeric={column.numeric}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <Tooltip
                    title="Сортировка"
                    placement={column.numeric ? "bottom-end" : "bottom-start"}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={order}
                      onClick={this.createSortHandler(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              );
            }
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

RepositoriesTableHead.propTypes = {
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired
};

export default RepositoriesTableHead;

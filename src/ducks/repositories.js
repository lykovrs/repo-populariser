import { all, takeLatest, put, call } from "redux-saga/effects";
import { appName } from "../config";
import { Record, List } from "immutable";
import { createSelector } from "reselect";
import { client } from "../ApolloClient";
import gql from "graphql-tag";
import dayjs from "dayjs";

/**
 * Constants
 * */
export const moduleName = "repositories";
const prefix = `${appName}/${moduleName}`;

export const CLEAR = `${prefix}/CLEAR`;

export const FETCH_ITEMS_REQUEST = `${prefix}/FETCH_ITEMS_REQUEST`;
export const FETCH_ITEMS_START = `${prefix}/FETCH_ITEMS_START`;
export const FETCH_ITEMS_SUCCESS = `${prefix}/FETCH_ITEMS_SUCCESS`;
export const FETCH_ITEMS_ERROR = `${prefix}/FETCH_ITEMS_ERROR`;

export const CLEAR_MESSAGE = `${prefix}/CLEAR_MESSAGE`;

/**
 * Reducer
 * */
export const ItemRecord = Record({
  id: null,
  name: null,
  description: null,
  stargazers: null,
  forks: null,
  updatedAt: null,
  createdAt: null
});

export const QueryParamsRecord = Record({
  amount: null,
  fromDate: null
});

export const ReducerRecord = Record({
  items: new List([]),
  messages: new List([]),
  loading: false,
  queryParams: new QueryParamsRecord()
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action;

  switch (type) {
    case CLEAR:
      return new ReducerRecord();

    case FETCH_ITEMS_START:
      return state
        .set("items", new List([]))
        .set("loading", true)
        .set("queryParams", new QueryParamsRecord(payload));

    case FETCH_ITEMS_ERROR:
      return state.set("loading", false).updateIn(["messages"], fav => {
        return fav.push(action.payload.message);
      });

    case FETCH_ITEMS_SUCCESS:
      const { items } = payload;
      return state
        .set("items", new List(items))
        .set("loading", false)
        .updateIn(["messages"], fav => {
          return fav.push(action.payload.message);
        });

    case CLEAR_MESSAGE:
      return state.set(
        "messages",
        state.messages.filter(message => message !== action.payload)
      );

    default:
      return state;
  }
}

/**
 * Selectors
 * */
export const stateSelector = state => state[moduleName];
export const reportItemsSelector = createSelector(stateSelector, state => {
  return state.items.toJS();
});

export const reportLoadingSelector = createSelector(
  stateSelector,
  state => state.loading
);

export const reportMessagesSelector = createSelector(stateSelector, state =>
  state.messages.toArray()
);

export const queryParamsSelector = createSelector(stateSelector, state =>
  state.queryParams.toJS()
);

/**
 * Action Creators
 * */
export function clearRepositories() {
  return {
    type: CLEAR
  };
}

export function fetchRepositories(fromDate, amount) {
  return {
    type: FETCH_ITEMS_REQUEST,
    payload: { fromDate, amount }
  };
}

export function clearRepositoriesMessage(message) {
  return {
    type: CLEAR_MESSAGE,
    payload: message
  };
}

function modifyData(arr) {
  return arr.map(item => {
    const node = item.node;

    return new ItemRecord({
      id: node.id,
      name: node.name,
      description: node.description,
      stargazers: node.stargazers.totalCount,
      forks: node.forks.totalCount,
      updatedAt: `${dayjs(node.updatedAt).format("DD.MM.YYYY")}`,
      createdAt: `${dayjs(node.createdAt).format("DD.MM.YYYY")}`
    });
  });
}

/**
 * Делает запрос на сервер за данными отчета
 */
export async function fetchGraphQLRepositories(from, last) {
  const { data } = await client.query({
    query: gql`
      {
        search(
          query: "language:JavaScript created:>${from}"
          type: REPOSITORY
          last: ${last}
        ) {
          repositoryCount
          edges {
            node {
              ... on Repository {
                id
                name
                description
                stargazers {
                  totalCount
                }
                forks {
                  totalCount
                }
                updatedAt
                createdAt
              }
            }
          }
        }
      }
    `
  });

  return modifyData(data.search.edges);
}

/**
 * Sagas
 * */
export function* fetchRepositoriesSaga(action) {
  const { amount, fromDate } = action.payload;

  yield put({
    type: FETCH_ITEMS_START,
    payload: { amount, fromDate }
  });

  try {
    const data = yield call(fetchGraphQLRepositories, fromDate, amount);
    yield put({
      type: FETCH_ITEMS_SUCCESS,
      payload: { items: data, message: "Отчет успешно сформирован" }
    });
  } catch (error) {
    yield put({
      type: FETCH_ITEMS_ERROR,
      payload: { message: "Ошибка получения данных отчета" }
    });
  }
}

export function* saga() {
  yield all([takeLatest(FETCH_ITEMS_REQUEST, fetchRepositoriesSaga)]);
}

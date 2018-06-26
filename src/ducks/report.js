import { all, takeEvery, put, call } from "redux-saga/effects";
import { appName } from "../config";
import { Record, List } from "immutable";
import { createSelector } from "reselect";
import { mockRepoNodes } from "./mock";
/**
 * Constants
 * */
export const moduleName = "report";
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
  updatedAt: null
});

export const ReducerRecord = Record({
  items: new List([]),
  messages: [],
  loading: false
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action;

  switch (type) {
    case CLEAR:
      return new ReducerRecord();

    case FETCH_ITEMS_START:
      return state.set("items", new List([])).set("loading", true);

    case FETCH_ITEMS_ERROR:
      return state
        .set("loading", false)
        .set("messages", [...state.get("messages"), action.payload.message]);

    case FETCH_ITEMS_SUCCESS:
      const { items } = payload;
      return state
        .set("items", new List(items))
        .set("loading", false)
        .set("messages", [...state.get("messages"), action.payload.message]);

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

export const reportMessagesSelector = createSelector(
  stateSelector,
  state => state.messages
);

/**
 * Action Creators
 * */
export function clearReport() {
  return {
    type: CLEAR
  };
}

export function fetchReport(id) {
  return {
    type: FETCH_ITEMS_REQUEST,
    payload: {
      id
    }
  };
}

export function clearReportMessage(message) {
  return {
    type: CLEAR_MESSAGE,
    payload: message
  };
}

/**
 * Делает запрос на сервер за данными отчета
 * @param id видео
 * @returns {}
 */
export async function fetchGraphQLReport(id) {
  const items = mockRepoNodes.data.search.edges;

  const newItems = items.map(item => {
    const node = item.node;

    return new ItemRecord({
      id: node.id,
      name: node.name,
      description: node.description,
      stargazers: node.stargazers.totalCount,
      forks: node.forks.totalCount,
      updatedAt: node.updatedAt
    });
  });

  const promise = await new Promise(function(resolve, reject) {
    setTimeout(() => {
      resolve({ data: newItems });
    }, 1000);
  });

  console.log("items ====>", items);

  return promise;
}

/**
 * Sagas
 * */
export function* fetchReportSaga(action) {
  const { id } = action.payload;

  yield put({
    type: FETCH_ITEMS_START,
    payload: {
      id
    }
  });

  try {
    const { data } = yield call(fetchGraphQLReport, id);
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
  yield all([takeEvery(FETCH_ITEMS_REQUEST, fetchReportSaga)]);
}

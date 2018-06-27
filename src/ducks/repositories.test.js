import reducer, {
  fetchRepositoriesSaga,
  fetchAxiosRepositories,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_START,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEMS_ERROR,
  ReducerRecord
} from "./repositories";
import { take, call, put, takeEvery } from "redux-saga/effects";

/**
 * Saga tests
 * */
it("should fetch items", () => {
  const id = Date.now();
  const requestAction = {
    type: FETCH_ITEMS_REQUEST,
    payload: {
      id
    }
  };

  const saga = fetchRepositoriesSaga(requestAction);

  expect(saga.next().value).toEqual(
    put({
      type: FETCH_ITEMS_START,
      payload: {
        id
      }
    })
  );

  expect(saga.next(FETCH_ITEMS_START).value).toEqual(
    call(fetchAxiosRepositories, id)
  );

  expect(saga.next(FETCH_ITEMS_SUCCESS).value).toEqual(
    put({
      type: FETCH_ITEMS_SUCCESS,
      payload: { items: undefined, message: "Отчет успешно сформирован" }
    })
  );

  const error = new Error();

  expect(saga.throw(error).value).toEqual(
    put({
      type: FETCH_ITEMS_ERROR,
      payload: { message: "Ошибка получения данных отчета" }
    })
  );
});

it("should export to file", () => {});

/**
 * Reducer Tests
 * */

it("should fetch report", () => {
  const state = new ReducerRecord();
  const items = [];
  const messages = [];
  const message = `message`;

  const newState = reducer(state, {
    type: FETCH_ITEMS_SUCCESS,
    payload: { items, message }
  });

  expect(newState).toEqual(
    new ReducerRecord({ items, messages: [...messages, message] })
  );
});

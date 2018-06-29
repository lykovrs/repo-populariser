import reducer, {
  fetchRepositoriesSaga,
  fetchAxiosRepositories,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_START,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEMS_ERROR,
  ReducerRecord,
  fetchGraphQLRepositories,
  QueryParamsRecord,
  CLEAR_MESSAGE
} from "./repositories";
import { List } from "immutable";
import { call, put } from "redux-saga/effects";

/**
 * Saga tests
 * */
it("should fetch items", () => {
  const fromDate = "2018-03-03";
  const amount = 10;
  const requestAction = {
    type: FETCH_ITEMS_REQUEST,
    payload: {
      fromDate,
      amount
    }
  };

  const saga = fetchRepositoriesSaga(requestAction);

  expect(saga.next().value).toEqual(
    put({
      type: FETCH_ITEMS_START,
      payload: {
        amount,
        fromDate
      }
    })
  );

  expect(saga.next().value).toEqual(
    call(fetchGraphQLRepositories, fromDate, amount)
  );

  const dataArr = [];

  expect(saga.next(dataArr).value).toEqual(
    put({
      type: FETCH_ITEMS_SUCCESS,
      payload: { items: dataArr, message: "Отчет успешно сформирован" }
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

/**
 * Reducer Tests
 * */
it("should start fetching items, start loading", () => {
  const fromDate = "2018-03-03";
  const amount = 10;

  const state = new ReducerRecord();

  const newState = reducer(state, {
    type: FETCH_ITEMS_START,
    payload: {
      fromDate,
      amount
    }
  });

  expect(newState).toEqual(
    new ReducerRecord()
      .set("queryParams", new QueryParamsRecord({ fromDate, amount }))
      .set("loading", true)
  );
});

it("should set new items and message, stop loading", () => {
  const state = new ReducerRecord().set("loading", true);
  const items = new List();

  const newState = reducer(state, {
    type: FETCH_ITEMS_SUCCESS,
    payload: { items, message: "new message" }
  });

  const newItems = new List();
  const updatedMessages = new List(["new message"]);

  expect(newState).toEqual(
    new ReducerRecord()
      .set("items", newItems)
      .set("messages", updatedMessages)
      .set("loading", false)
  );
});

it("should set error message and stop loading", () => {
  const state = new ReducerRecord().set("loading", true);

  const newState = reducer(state, {
    type: FETCH_ITEMS_ERROR,
    payload: { message: "error message" }
  });

  const updatedMessages = new List(["error message"]);

  expect(newState).toEqual(
    new ReducerRecord().set("messages", updatedMessages).set("loading", false)
  );
});

it("it remove message from list", () => {
  const state = new ReducerRecord().set(
    "messages",
    new List(["hello", "message", "world"])
  );

  const newState = reducer(state, {
    type: CLEAR_MESSAGE,
    payload: "message"
  });

  expect(newState).toEqual(
    new ReducerRecord().set("messages", new List(["hello", "world"]))
  );
});

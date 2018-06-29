import reducer, {
  SIGN_IN_REQUEST,
  SIGN_IN_START,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT_REQUEST,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAILURE,
  ReducerRecord,
  fetchLogInSaga,
  fetchLogOutSaga
} from "./auth";
import { List, Map } from "immutable";
import { call, put } from "redux-saga/effects";

/**
 * Saga tests
 * */
it("sign in saga tests", () => {
  const name = "testLogin";
  const password = "lorem";
  const requestAction = {
    type: SIGN_IN_REQUEST,
    payload: {
      name,
      password
    }
  };
  const saga = fetchLogInSaga(requestAction);

  expect(saga.next().value).toEqual(
    put({
      type: SIGN_IN_START
    })
  );
  expect(saga.next().value).toEqual(
    put({
      type: SIGN_IN_SUCCESS,
      payload: {
        name,
        password
      }
    })
  );

  const error = new Error();

  expect(saga.throw(error).value).toEqual(
    put({
      type: SIGN_IN_FAILURE
    })
  );
});

it("sign out saga tests", () => {
  const requestAction = {
    type: SIGN_OUT_REQUEST
  };
  const saga = fetchLogOutSaga(requestAction);

  expect(saga.next().value).toEqual(
    put({
      type: SIGN_OUT_SUCCESS
    })
  );

  const error = new Error();

  expect(saga.throw(error).value).toEqual(
    put({
      type: SIGN_OUT_FAILURE
    })
  );
});

/**
 * Reducer Tests
 * */

it("should start login user, start loading", () => {
  const state = new ReducerRecord();

  const newState = reducer(state, {
    type: SIGN_IN_START
  });

  expect(newState).toEqual(new ReducerRecord().set("loading", true));
});

it("should set user, stop loading", () => {
  const name = "testLogin";
  const password = "lorem";

  const state = new ReducerRecord().set("loading", true);

  const newState = reducer(state, {
    type: SIGN_IN_SUCCESS,
    payload: { name, password }
  });

  expect(newState).toEqual(
    new ReducerRecord()
      .set("user", new Map({ name, password }))
      .set("isAuthenticated", true)
      .set("loading", false)
  );
});

it("should sign out success", () => {
  const name = "testLogin";
  const password = "lorem";
  const state = new ReducerRecord()
    .set("user", new Map({ name, password }))
    .set("isAuthenticated", true);

  const newState = reducer(state, {
    type: SIGN_OUT_SUCCESS
  });

  expect(newState).toEqual(new ReducerRecord());
});

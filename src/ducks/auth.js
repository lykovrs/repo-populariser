import { appName } from "../config";
import { Record, Map } from "immutable";
import { createSelector } from "reselect";
import { all, takeEvery, put } from "redux-saga/effects";

/**
 * Constants
 * */
export const moduleName = "auth";
const prefix = `${appName}/${moduleName}`;

export const SIGN_IN_REQUEST = `${prefix}/SIGN_IN_REQUEST`;
export const SIGN_IN_START = `${prefix}/SIGN_IN_START`;
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`;
export const SIGN_IN_FAILURE = `${prefix}/SIGN_IN_FAILURE`;

export const SIGN_OUT_REQUEST = `${prefix}/SIGN_OUT_REQUEST`;
export const SIGN_OUT_SUCCESS = `${prefix}/SIGN_OUT_SUCCESS`;
export const SIGN_OUT_FAILURE = `${prefix}/SIGN_OUT_FAILURE`;

/**
 * Reducer
 * */
export const ReducerRecord = Record({
  isAuthenticated: false,
  loading: false,
  user: new Map({ name: null, password: null })
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type } = action;

  switch (type) {
    case SIGN_IN_START:
      return state.set("loading", true);

    case SIGN_IN_SUCCESS:
      return state
        .set("isAuthenticated", true)
        .set("loading", false)
        .set("user", new Map(action.payload));

    case SIGN_OUT_SUCCESS:
      return new ReducerRecord();
    default:
      return state;
  }
}

/**
 * Selectors
 * */
export const stateSelector = state => state[moduleName];

export const isAuthenticatedSelector = createSelector(
  stateSelector,
  state => state.isAuthenticated
);

export const userSelector = createSelector(stateSelector, state =>
  state.user.toJS()
);

/**
 * Action Creators
 * */
export function logIn(name, password) {
  return {
    type: SIGN_IN_REQUEST,
    payload: {
      name,
      password
    }
  };
}

export function logOut() {
  return {
    type: SIGN_OUT_REQUEST
  };
}

/**
 * Sagas
 * */
export function* fetchLogInSaga(action) {
  const { name, password } = action.payload;
  yield put({
    type: SIGN_IN_START
  });

  try {
    yield put({
      type: SIGN_IN_SUCCESS,
      payload: {
        name,
        password
      }
    });
  } catch (e) {
    yield put({
      type: SIGN_IN_FAILURE
    });
  }
}

export function* fetchLogOutSaga(action) {
  try {
    yield put({
      type: SIGN_OUT_SUCCESS
    });
  } catch (e) {
    yield put({
      type: SIGN_OUT_FAILURE
    });
  }
}

export function* saga() {
  yield all([takeEvery(SIGN_IN_REQUEST, fetchLogInSaga)]);
  yield all([takeEvery(SIGN_OUT_REQUEST, fetchLogOutSaga)]);
}

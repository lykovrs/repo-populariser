import { all } from "redux-saga/effects";
import { saga as authSaga } from "../ducks/auth";
import { saga as reportSaga } from "../ducks/report";

export default function* rootSaga() {
  yield all([authSaga(), reportSaga()]);
}

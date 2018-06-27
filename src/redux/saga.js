import { all } from "redux-saga/effects";
import { saga as authSaga } from "../ducks/auth";
import { saga as reportSaga } from "../ducks/repositories";

export default function* rootSaga() {
  yield all([authSaga(), reportSaga()]);
}

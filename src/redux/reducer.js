import { combineReducers } from "redux";
import authReducer, { moduleName as authModule } from "../ducks/auth";
import reportReducer, { moduleName as reportModule } from "../ducks/report";

export default combineReducers({
  [authModule]: authReducer,
  [reportModule]: reportReducer
});

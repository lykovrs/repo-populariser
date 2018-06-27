import { combineReducers } from "redux";
import authReducer, { moduleName as authModule } from "../ducks/auth";
import reportReducer, {
  moduleName as reportModule
} from "../ducks/repositories";

export default combineReducers({
  [authModule]: authReducer,
  [reportModule]: reportReducer
});

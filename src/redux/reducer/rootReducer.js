import { combineReducers } from "redux";
import dataReducer from "./dataReducer";
import signatureReducer from "./signatureReducer";

const rootReducer = combineReducers({
  dataReducer,
  signatureReducer,
});

export default rootReducer;

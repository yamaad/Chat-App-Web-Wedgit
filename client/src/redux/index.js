import { combineReducers } from "redux";
import agentReducer from "./agentSlice";

const rootReducer = combineReducers({
  agent: agentReducer,
});

export default rootReducer;

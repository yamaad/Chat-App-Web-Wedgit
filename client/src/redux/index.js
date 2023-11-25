import { combineReducers } from "redux";
import agentReducer from "./agentSlice";
import messagesReducer from "./messagesSlice";

const rootReducer = combineReducers({
  agent: agentReducer,
  messages: messagesReducer,
});

export default rootReducer;

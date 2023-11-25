import { combineReducers } from "redux";
import agentReducer from "./agentSlice";
import messagesReducer from "./messagesSlice";
import conversationReducer from "./conversationSlice";

const rootReducer = combineReducers({
  agent: agentReducer,
  messages: messagesReducer,
  conversation: conversationReducer,
});

export default rootReducer;

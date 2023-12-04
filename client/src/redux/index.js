import { combineReducers } from "redux";
import agentReducer from "./agentSlice";
import messagesReducer from "./messagesSlice";
import conversationReducer from "./conversationSlice";
import lastMessageReducer from "./lastMessageSlice";
const rootReducer = combineReducers({
  agent: agentReducer,
  messages: messagesReducer,
  conversation: conversationReducer,
  lastMessage: lastMessageReducer,
});

export default rootReducer;

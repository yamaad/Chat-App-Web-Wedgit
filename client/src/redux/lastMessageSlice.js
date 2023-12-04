import { createSlice } from "@reduxjs/toolkit";

const lastMessageSlice = createSlice({
  name: "lastMessage",
  initialState: {
    lastMessages: {}, // Object to store last messages by conversation ID
  },
  reducers: {
    setLastMessage: (state, action) => {
      const { conversationId, lastMessage } = action.payload;
      state.lastMessages[conversationId] = lastMessage;
    },
    deleteLastMessage: (state, action) => {
      const { conversationId } = action.payload;
      if (state.lastMessages.hasOwnProperty(conversationId)) {
        delete state.lastMessages[conversationId];
      }
    },
  },
});

export const { setLastMessage, deleteLastMessage } = lastMessageSlice.actions;

export const selectLastMessages = (state) => state.lastMessage.lastMessages;

export default lastMessageSlice.reducer;

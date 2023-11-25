import { createSlice } from "@reduxjs/toolkit";
const initialState = { conversation: null };
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversation: (state, action) => {
      state.conversation = action.payload;
    },
  },
});

export const { setConversation } = conversationSlice.actions;
export default conversationSlice.reducer;

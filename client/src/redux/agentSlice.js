import { createSlice } from "@reduxjs/toolkit";
const initialState = { agent: null };
const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    setAgent: (state, action) => {
      state.agent = action.payload;
    },
  },
});

export const { setAgent } = agentSlice.actions;
export default agentSlice.reducer;

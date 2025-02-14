import { createSlice } from "@reduxjs/toolkit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialState: { user: any } = { user: {} };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});
export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;

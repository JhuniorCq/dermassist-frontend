import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type UserState } from "../types/user";

const initialState: UserState = {
  email: "",
  uid: "",
  username: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.username = action.payload.username;
    },
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;

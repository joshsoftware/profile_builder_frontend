import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  role: null,
  profile_id: null,
  name: null,
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.profile_id = action.payload.profile_id;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.profile_id = null;
      state.name = null;
      state.email = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { loginApi } from "../loginApi";
import { profileApi } from "../profileApi";
import authReducer from "./authSlice";

const token = window.localStorage.getItem("token");
const preloadedState = {
  auth: {
    token: token ? token : null,
  },
};
const rootReducer = combineReducers({
  [loginApi.reducerPath]: loginApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loginApi.middleware, profileApi.middleware),
});

export default store;

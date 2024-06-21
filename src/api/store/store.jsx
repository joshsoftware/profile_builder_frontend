import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { achievementApi } from "../achievementApi";
import { certificateApi } from "../certificateApi";
import { educationApi } from "../educationApi";
import { experienceApi } from "../experienceApi";
import { loginApi } from "../loginApi";
import { profileApi } from "../profileApi";
import { projectApi } from "../projectApi";
import authReducer from "./authSlice";

const token = window.localStorage.getItem("token");
const preloadedState = {
  auth: {
    token: token ? token : null
  }
};
const rootReducer = combineReducers({
  [loginApi.reducerPath]: loginApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [educationApi.reducerPath]: educationApi.reducer,
  [experienceApi.reducerPath]: experienceApi.reducer,
  [achievementApi.reducerPath]:achievementApi.reducer,
  [certificateApi.reducerPath]:certificateApi.reducer,
  auth: authReducer
});

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loginApi.middleware, profileApi.middleware, projectApi.middleware, educationApi.middleware, experienceApi.middleware, achievementApi.middleware, certificateApi.middleware)
});

export default store;

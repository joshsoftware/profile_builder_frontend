import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { achievementApi } from "../achievementApi";
import { certificationApi } from "../certificationApi";
import { educationApi } from "../educationApi";
import { userEmailApi } from "../emailApi";
import { experienceApi } from "../experienceApi";
import { loginApi } from "../loginApi";
import { profileApi } from "../profileApi";
import { projectApi } from "../projectApi";
import authReducer from "./authSlice";

const token = window.localStorage.getItem("token");
const role = window.localStorage.getItem("role");
const profile_id = window.localStorage.getItem("profile_id");

const preloadedState = {
  auth: {
    token: token ? token : null,
    role: role ? role : null,
    profile_id: profile_id ? profile_id : null,
  },
};

const rootReducer = combineReducers({
  [loginApi.reducerPath]: loginApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [achievementApi.reducerPath]: achievementApi.reducer,
  [certificationApi.reducerPath]: certificationApi.reducer,
  [educationApi.reducerPath]: educationApi.reducer,
  [experienceApi.reducerPath]: experienceApi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [userEmailApi.reducerPath]: userEmailApi.reducer,
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      loginApi.middleware,
      profileApi.middleware,
      achievementApi.middleware,
      certificationApi.middleware,
      educationApi.middleware,
      experienceApi.middleware,
      projectApi.middleware,
      userEmailApi.middleware,
    ),
});

export default store;

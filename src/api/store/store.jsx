import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { getLocalStorage } from "../../helpers";
import { achievementApi } from "../achievementApi";
import { certificationApi } from "../certificationApi";
import { educationApi } from "../educationApi";
import { userEmailApi } from "../emailApi";
import { experienceApi } from "../experienceApi";
import { loginApi } from "../loginApi";
import { profileApi } from "../profileApi";
import { projectApi } from "../projectApi";
import authReducer from "./authSlice";

const {
  profile_id = null,
  name = null,
  email = null,
  role = null,
  token = null,
} = getLocalStorage() || {};

// Initialize preloadedState
const preloadedState = {
  auth: {
    profile_id,
    name,
    email,
    role,
    token,
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

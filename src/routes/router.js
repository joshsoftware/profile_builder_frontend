import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Editor } from "../components/Builder/Index";
import Dashboard from "../components/Dashboard";
import Error from "../components/Error/Error";
import Login from "../components/Login";
import ListProfiles from "../components/Profile/List";
import {
  DASHBOARD_ROUTE,
  EDITOR_PROFILE_ROUTE,
  EDITOR_ROUTE,
  ERROR_ROUTE,
  PROFILE_LIST_ROUTE,
  ROOT_ROUTE,
} from "../Constants";
import ProtectedRoutes from "./ProtectedRoutes";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROOT_ROUTE} element={<Login />} />
        <Route
          path={PROFILE_LIST_ROUTE}
          element={
            <ProtectedRoutes
              Component={ListProfiles}
              allowedRoles={["admin"]}
            />
          }
        />
        <Route
          path={DASHBOARD_ROUTE}
          element={
            <ProtectedRoutes Component={Dashboard} allowedRoles={["admin"]} />
          }
        />
        <Route
          path={EDITOR_ROUTE}
          element={
            <ProtectedRoutes Component={Editor} allowedRoles={["admin"]} />
          }
        />
        <Route
          path={`${EDITOR_PROFILE_ROUTE}/:profile_id`}
          element={
            <ProtectedRoutes
              Component={Editor}
              allowedRoles={["admin", "employee"]}
            />
          }
        />
        <Route
          path={EDITOR_PROFILE_ROUTE}
          element={
            <ProtectedRoutes Component={Editor} allowedRoles={["admin"]} />
          }
        />
        <Route path={ERROR_ROUTE} element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

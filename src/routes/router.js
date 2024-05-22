import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import { Editor } from "../components/Builder/Index";
import ListProfiles from "../components/Profile/List";
import Login from "../components/Login";
import ProtectedRoutes from "./ProtectedRoutes";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/profiles"
          element={<ProtectedRoutes Component={ListProfiles} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoutes Component={Dashboard} />}
        />
        <Route
          path="/profile-builder"
          element={<ProtectedRoutes Component={Editor} />}
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

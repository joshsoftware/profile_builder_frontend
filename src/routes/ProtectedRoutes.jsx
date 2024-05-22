import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// TODO :store the token in the redux store

const ProtectedRoutes = (props) => {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const { Component } = props;
  console.log("token in protected ", token);
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  });

  return <Component />;
};

ProtectedRoutes.propTypes = {
  Component: PropTypes.func.isRequired,
};

export default ProtectedRoutes;

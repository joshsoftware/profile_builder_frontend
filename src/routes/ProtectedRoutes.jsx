import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ROOT_ROUTE } from "../Constants";

const ProtectedRoutes = (props) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { Component } = props;
  useEffect(() => {
    if (!token) {
      navigate(ROOT_ROUTE);
    }
  });

  return <Component />;
};

ProtectedRoutes.propTypes = {
  Component: PropTypes.func.isRequired
};

export default ProtectedRoutes;

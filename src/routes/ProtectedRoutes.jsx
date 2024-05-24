import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

const ProtectedRoutes = (props) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { Component } = props;
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

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { EDITOR_PROFILE_ROUTE, EMPLOYEE, ROOT_ROUTE } from "../Constants";

const ProtectedRoutes = ({ Component, allowedRoles }) => {
  const navigate = useNavigate();
  const { profile_id: urlProfileId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const profile_id = useSelector((state) => state.auth.profile_id);

  useEffect(() => {
    if (!token) {
      navigate(ROOT_ROUTE);
    } else if (!allowedRoles.includes(role)) {
      navigate(EDITOR_PROFILE_ROUTE.replace(":profile_id", profile_id));
    } else if (
      role === EMPLOYEE &&
      urlProfileId &&
      urlProfileId !== String(profile_id)
    ) {
      navigate(EDITOR_PROFILE_ROUTE.replace(":profile_id", profile_id));
    }
  }, [token, role, profile_id, urlProfileId, allowedRoles, navigate]);

  return token ? <Component /> : null;
};

ProtectedRoutes.propTypes = {
  Component: PropTypes.func.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoutes;

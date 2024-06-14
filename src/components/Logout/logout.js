import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/store/authSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
    window.localStorage.removeItem("token");
    navigate("/logout");
  }, [dispatch, navigate]);
};

export default Logout;

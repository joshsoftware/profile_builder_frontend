import { useDispatch } from "react-redux";

import { logout } from "../../api/store/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  dispatch(logout());
  localStorage.removeItem("token");
};

export default Logout;

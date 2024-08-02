import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Image, Typography } from "antd";
import { useGoogleLogin } from "@react-oauth/google";
import { useLoginMutation } from "../../api/loginApi";
import { login as loginAction } from "../../api/store/authSlice";
import googleIcon from "../../assets/icons8-google-48.png";
import {
  EDITOR_PROFILE_ROUTE,
  PROFILE_LIST_ROUTE,
  ROOT_ROUTE,
} from "../../Constants";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginService] = useLoginMutation();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        const response = await loginService(accessToken);
        const token = response?.data?.token;
        const role = response?.data?.role;
        const profile_id = response?.data?.profile_id;
        toast.success(response?.data?.message);

        if (token && response?.data?.role && response?.data?.profile_id) {
          dispatch(loginAction({ token, role, profile_id }));
          window.localStorage.setItem("token", token);
          window.localStorage.setItem("role", role);
          window.localStorage.setItem("profile_id", profile_id);

          if (response?.data?.role.toLowerCase() === "admin") {
            navigate(PROFILE_LIST_ROUTE);
          } else if (response?.data?.role.toLowerCase() === "employee") {
            navigate(
              EDITOR_PROFILE_ROUTE.replace(
                ":profile_id",
                response?.data?.profile_id,
              ),
            );
          } else {
            navigate(ROOT_ROUTE);
          }
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onError: (errorResponse) => {
      throw new Error(errorResponse.error);
    },
  });

  return (
    <div className={styles.divStyle}>
      <Typography.Title level={1}>Sign In With Google</Typography.Title>
      <Button className={styles.buttonStyle} onClick={() => login()}>
        <Image width={40} src={googleIcon} alt="Google Icon" />
        Login With Google
      </Button>
    </div>
  );
};

export default Login;

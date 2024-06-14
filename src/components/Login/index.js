import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Image, Typography } from "antd";
import { useGoogleLogin } from "@react-oauth/google";
import { useLoginMutation } from "../../api/loginApi";
import { login as loginAction } from "../../api/store/authSlice";
import googleIcon from "../../assets/icons8-google-48.png";
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
        if (token) {
          dispatch(loginAction({ token }));
          window.localStorage.setItem("token", token);
          navigate("/profiles");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onError: (errorResponse) => {
      throw new Error(errorResponse.error);
    }
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

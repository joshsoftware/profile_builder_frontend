import React from "react";
import googleIcon from "../../assets/icons8-google-48.png";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { post } from "../../services/axios";
import { useNavigate } from "react-router-dom";

const buttonStyle = {
  backgroundColor: "#4285F4",
  color: "white",
  border: "none",
  padding: "15px 32px",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "20px",
  margin: "4px 2px",
  cursor: "pointer",
  borderRadius: "12px",
};

const divStyle = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  height: "50vh",
};

const Login = () => {
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationKey: "login",
    mutationFn: async ({ url, access_token }) => {
      return post(url, { access_token: access_token });
    },
    onSuccess: (response) => {
      if (response && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      navigate("/dashboard");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      mutate({ url: "/login", access_token: accessToken });
    },
    onError: (errorResponse) => {
      console.log("Error:", errorResponse.error);
    },
  });

  return (
    <>
      <div style={divStyle}>
        <h1>Login With Google</h1>
        <button style={buttonStyle} onClick={() => login()}>
          <img src={googleIcon} alt="Google Icon" />
          Login With Google
        </button>
      </div>
    </>
  );
};

export default Login;

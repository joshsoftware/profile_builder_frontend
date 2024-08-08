import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import { ROOT_ROUTE } from "../../Constants";
const Error = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button onClick={() => navigate(ROOT_ROUTE)} type="primary">
          Back To Home
        </Button>
      }
    />
  );
};

export default Error;

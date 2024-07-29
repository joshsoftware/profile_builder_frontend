import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Button, Layout, Menu } from "antd";
import { EditOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { logout } from "../../api/store/authSlice";
import joshLogo from "../../assets/Josh-new-logo.png";
import { EDITOR_ROUTE, PROFILE_LIST_ROUTE } from "../../Constants";
import { showConfirm } from "../../helpers";

const Navbar = () => {
  const dispatch = useDispatch();
  const { Header } = Layout;
  const location = useLocation();
  const showModal = () => {
    showConfirm({
      onOk: () => {
        dispatch(logout());
        window.localStorage.removeItem("token");
        toast.success("Logged out successfully");
      },
      onCancel: () => {},
      message: "Are you sure you want to logout?",
    });
  };

  const selectedKey = location.pathname;

  const getButtonStyle = (route) => ({
    color: selectedKey === route ? "white" : "#ffffff",
    border: selectedKey === route ? "2px solid white" : "none",
    fontSize: "15px",
  });

  return (
    <Layout>
      <Header
        style={{
          position: "fixed",
          top: 0,
          zIndex: 100,
          width: "100%",
          display: "block",
          alignItems: "center",
        }}
      >
        <img
          src={joshLogo}
          alt="josh-logo"
          style={{ marginRight: "50px", paddingBottom: "10px" }}
        />
        <Link to={PROFILE_LIST_ROUTE}>
          <Button
            type="text"
            icon={<UserOutlined />}
            style={getButtonStyle(PROFILE_LIST_ROUTE)}
          >
            Profiles
          </Button>
        </Link>
        <Link to={EDITOR_ROUTE}>
          <Button
            type="text"
            icon={<EditOutlined />}
            style={getButtonStyle(EDITOR_ROUTE)}
          >
            Editor
          </Button>
        </Link>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          style={{
            marginRight: "auto",
            paddingTop: "16px",
            color: "white",
            fontSize: "17px",
            float: "right",
          }}
          onClick={showModal}
        >
          Logout
        </Button>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
    </Layout>
  );
};

export default Navbar;

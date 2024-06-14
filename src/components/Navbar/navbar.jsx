import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Layout, Menu, Modal } from "antd";
import { EditOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import joshLogo from "../../assets/Josh-new-logo.png";
import Logout from "../Logout/logout";

const Navbar = () => {
  const { Header } = Layout;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    setIsLogout(true);
    console.log("logout");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center"
        }}
      >
        <img
          src={joshLogo}
          alt="josh-logo"
          style={{ marginRight: "50px", paddingBottom: "10px" }}
        />
        <Link to={"/profiles"}>
          <Button
            type="text"
            icon=<UserOutlined />
            style={{ marginRight: "auto", color: "white", fontSize: "20px" }}
          >
            Profiles
          </Button>
        </Link>
        <Link to={"/profile-builder"}>
          <Button
            type="text"
            href="/profile-builder"
            icon=<EditOutlined />
            style={{ marginRight: "auto", color: "white", fontSize: "20px" }}
          >
            Editor
          </Button>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          style={{
            flex: 1,
            minWidth: 0
          }}
        />

        <Button
          type="text"
          icon=<LogoutOutlined />
          style={{
            marginRight: "auto",
            paddingBottom: "36px",
            color: "white",
            fontSize: "20px"
          }}
          onClick={showModal}
        >
          Logout
        </Button>
      </Header>
      <Modal
        title="Confirm Logout"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
      {isLogout && <Logout />}
    </Layout>
  );
};
export default Navbar;

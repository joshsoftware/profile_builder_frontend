import React from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";

const Modals = ({ isVisible, onOk, onCancel, message }) => {
  return (
    <Modal
      title={"Confirm "}
      centered
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText={"Yes"}
      cancelText={"No"}
      okButtonProps={{ style: { backgroundColor: "red" } }}
    >
      {message}
    </Modal>
  );
};

Modals.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
};

export default Modals;

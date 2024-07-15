import React from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";

const Modals = ({ isVisible, onOk, onCancel }) => {
  return (
    <Modal
      title={"Confirm Delete"}
      centered
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText={"Yes"}
      cancelText={"No"}
      okButtonProps={{ style: { backgroundColor: "red" } }}
    >
      Are you sure you want to delete?
    </Modal>
  );
};

Modals.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Modals;

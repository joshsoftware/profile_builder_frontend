import React from "react";
import styles from "./InputControl.module.css";

const InputControl = ({ label, errorMessage, ...props }) => {
  return (
    <div className={styles.container}>
      {label && <label htmlFor={label}>{label}</label>}
      <input type="text" id={label} {...props} />
      <span className={styles.errorMessage}>{errorMessage}</span>
    </div>
  );
};

export default InputControl;

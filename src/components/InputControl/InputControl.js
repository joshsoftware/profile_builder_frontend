import React from "react";
import styles from "./InputControl.module.css";

const InputControl = ({ label, errorMessage, isCompulsory, ...props }) => {
  return (
    <div className={`form-group ${styles.container}`}>
      {label && (
        <label htmlFor={label}>
          {label} {isCompulsory && <span className={styles.compulsory}>*</span>}
        </label>
      )}
      <input
        type="text"
        className="form-control"
        id={label}
        aria-describedby={label}
        {...props}
      />
      <span className={styles.errorMessage}>{errorMessage}</span>
    </div>
  );
};

export default InputControl;

import React from "react";
import styles from "./InputControl.module.css";

const TextAreaControl = ({ label, errorMessage, isCompulsory, ...props }) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          {label} {isCompulsory && <span className={styles.compulsory}>*</span>}
        </label>
      )}
      <textarea
        className="form-control"
        id="exampleFormControlTextarea1"
        {...props}
      ></textarea>
      <span className={styles.errorMessage}>{errorMessage}</span>
    </div>
  );
};

export default TextAreaControl;

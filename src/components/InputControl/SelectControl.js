import React from "react";
import styles from "./InputControl.module.css";

const SelectControl = ({
  selectOptions,
  errorMessage,
  isCompulsory,
  label,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={label} className="pb-1">
          {label} {isCompulsory && <span className={styles.compulsory}>*</span>}
        </label>
      )}
      <select
        {...props}
        className="form-control"
        aria-label={`${label}select example`}
      >
        <option selected>{label}</option>
        {selectOptions.map((item) => (
          <option value={item.value}>{item.name}</option>
        ))}
      </select>
      <span className={styles.errorMessage}>{errorMessage}</span>
    </div>
  );
};

export default SelectControl;

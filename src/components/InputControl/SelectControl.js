import React from "react";
import styles from "./InputControl.module.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const SelectControl = ({ errorMessage, isCompulsory, label, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={label} className="pb-1">
          {label} {isCompulsory && <span className={styles.compulsory}>*</span>}
        </label>
      )}
      {/* <select
        {...props}
        className="form-control"
        aria-label={`${label} Select example`}
      >
        <option value="">{label}</option>
        {selectOptions.map((item) => (
          <option value={item.value}>{item.name}</option>
        ))}
      </select> */}
      <Select {...props} components={animatedComponents} />
      <span className={styles.errorMessage}>{errorMessage}</span>
    </div>
  );
};

export default SelectControl;

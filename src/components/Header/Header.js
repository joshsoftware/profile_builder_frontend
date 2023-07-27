import React from "react";

import styles from "./Header.module.css";

import resumeSvg from "../../assets/resume.svg";

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <p className={styles.heading}>
          A <span>Profile</span> that Stands Out!
        </p>
        <p className={styles.heading}>
          Make Your Own Profile and <span>Download as PDF.</span>
        </p>
      </div>
      <div className={styles.right}>
        <img src={resumeSvg} alt="Resume" />
      </div>
    </div>
  );
};

export default Header;

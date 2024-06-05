import React from "react";
import resumeSvg from "../../assets/banner.svg";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <img src={resumeSvg} alt="Resume" />
      <p className={styles.heading}>
        A <span>Profile</span> that Stands Out! Make Your Own Profile and
        <span>Download as PDF.</span>
      </p>

      <button className={styles.createBtn}>Create My Resume</button>
    </div>
  );
};

export default Dashboard;

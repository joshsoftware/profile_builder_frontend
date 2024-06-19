import React from "react";

import styles from "./Dashboard.module.css";

import resumeSvg from "../../assets/banner.svg";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <img src={resumeSvg} alt="Resume" />
      <p className={styles.heading}>
        A <span>Profile</span> that Stands Out! Make Your Own Profile and{" "}
        <span>Download as PDF.</span>
      </p>

      <Link to={`/profiles`}>
      <button className={styles.createBtn}>Get it started!</button></Link>
    </div>
  );
};

export default Dashboard;

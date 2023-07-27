import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Body.module.css";
import { ArrowDown } from "react-feather";
import Editor from "../Editor/Editor";
import Resume from "../Resume/Resume";

import ReactToPrint from "react-to-print";

export const INTERNAL = "INTERNAL";
export const EXTERNAL = "EXTERNAL";
const Body = () => {
  const InternalProfile = { title: INTERNAL, color: "#35549c" };
  const ExternalProfile = { title: EXTERNAL, color: "#062e38" };

  //to print resume.
  const resumeRef = useRef();

  //to show resume profile and bgcolor.
  const [profile, setProfile] = useState(InternalProfile);

  const sections = {
    basicInfo: "Basic Info",
    project: "Projects",
    education: "Education",
    skills: "Skills",
    workExp: "Experience",
  };

  const resumeState = {
    [sections.basicInfo]: {
      id: sections.basicInfo,
      sectionTitle: sections.basicInfo,
      detail: {
        profile:
          "Passionate and dedicated software developer with 3+ years of experience looking for an opportunity where I can apply my skills and knowledge to enhance user experience, build scalable products and contribute to organization's success.",
      },
    },
    [sections.workExp]: {
      id: sections.workExp,
      sectionTitle: sections.workExp,
      details: [],
    },
    [sections.project]: {
      id: sections.project,
      sectionTitle: sections.project,
      details: [],
    },
    [sections.education]: {
      id: sections.education,
      sectionTitle: sections.education,
      details: [],
    },
    [sections.skills]: {
      id: sections.skills,
      sectionTitle: sections.skills,
      points: [],
    },
  };

  //contains resume information.
  const [resumeInformation, setResumeInformation] = useState(resumeState);

  const handleRadioButton = (event) => {
    if (event.target.value === InternalProfile.title) {
      setProfile(InternalProfile);
      setResumeInformation(resumeState);
    } else if (event.target.value === ExternalProfile.title) {
      setProfile(ExternalProfile);
      setResumeInformation(resumeState);
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.heading}>Profile Builder</p>
      <div className={styles.toolbar}>
        <div className={styles.colors}>
          <div className={styles.select}>
            <input
              type="radio"
              value={InternalProfile.title}
              name="profile"
              defaultChecked
              onChange={(e) => handleRadioButton(e)}
            />
            <label>{InternalProfile.title} PROFILE </label>

            <input
              type="radio"
              value={ExternalProfile.title}
              name="profile"
              onChange={(e) => handleRadioButton(e)}
            />
            <label> {ExternalProfile.title} PROFILE </label>
          </div>
        </div>

        <ReactToPrint
          trigger={() => {
            return (
              <button>
                Download <ArrowDown />
              </button>
            );
          }}
          content={() => resumeRef.current}
        />
      </div>
      <div className={styles.main}>
        <Editor
          sections={sections}
          information={resumeInformation}
          setInformation={setResumeInformation}
          profile={profile}
        />
        <Resume
          ref={resumeRef}
          sections={sections}
          information={resumeInformation}
          activeColor={profile.color}
          profile={profile.title}
        />
      </div>
    </div>
  );
};

export default Body;

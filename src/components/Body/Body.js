import React, { useCallback, useMemo, useRef, useState } from "react";
import styles from "./Body.module.css";
import { ArrowDown } from "react-feather";
import Editor from "../Editor/Editor";
import Resume from "../Resume/Resume";

import ReactToPrint from "react-to-print";
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

export const INTERNAL = "INTERNAL";
export const EXTERNAL = "EXTERNAL";
const Body = () => {
  const InternalProfile = { title: INTERNAL, color: "#35549c" };
  const ExternalProfile = { title: EXTERNAL, color: "#062e38" };
  const ProfileDetailsTabId = "profile-details";
  const ResumePreviewTabId = "preview";
  //to print resume.

  // to set active tabId
  const [activeTabId, setActiveTabId] = useState(ProfileDetailsTabId);

  //to show resume profile and bgcolor.
  const [profile, setProfile] = useState(InternalProfile);

  //Checkbox state to handle experience.
  const [showExperince, setShowExperience] = useState(false);

  const [showCertification, setShowCertification] = useState(false);

  //to hold resume ref to print resume.
  const resumeRef = useRef();

  //Based on state toggle we hav to dynamically changes section tabs.
  const sections = useMemo(() => {
    if (showExperince && showCertification) {
      return {
        basicInfo: "Basic Info",
        project: "Projects",
        education: "Education",
        skills: "Skills",
        workExp: "Experience",
        certification: "Certification",
      };
    } else if (showExperince) {
      return {
        basicInfo: "Basic Info",
        project: "Projects",
        education: "Education",
        skills: "Skills",
        workExp: "Experience",
      };
    } else if (showCertification) {
      return {
        basicInfo: "Basic Info",
        project: "Projects",
        education: "Education",
        skills: "Skills",
        certification: "Certification",
      };
    } else {
      return {
        basicInfo: "Basic Info",
        project: "Projects",
        education: "Education",
        skills: "Skills",
      };
    }
  }, [showExperince, showCertification]);

  //Defining each tabs information.
  const resumeState = {
    [sections.basicInfo]: {
      id: sections.basicInfo,
      sectionTitle: sections.basicInfo,
      detail: {
        profile:
          "Passionate and Dedicated Candidate Looking for an Opportunity where I can apply my Skills and Knowledge to Enhance user experience, build Scalable products and Contribute to organization's Success.",
      },
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

  //contains resume information and providing all tabs resume details.
  const [resumeInformation, setResumeInformation] = useState(resumeState);

  const handleRadioButton = (event) => {
    if (event.target.value === InternalProfile.title) {
      setProfile(InternalProfile);
    } else if (event.target.value === ExternalProfile.title) {
      setProfile(ExternalProfile);
    }
  };

  const ShowCertifications = useCallback(
    (event) => {
      if (event.target.checked) {
        sections.certification = "Certification";
        setResumeInformation((prev) => ({
          ...prev,
          [sections.certification]: {
            id: sections.certification,
            sectionTitle: sections.certification,
            points: [],
          },
        }));
      } else {
        delete sections.certification;
        delete resumeInformation.certification;
        setResumeInformation(resumeInformation);
      }
      setShowCertification(event.target.checked);
    },
    [showCertification]
  );

  const ShowExperience = useCallback(
    (event) => {
      if (event.target.checked) {
        sections.workExp = "Experience";
        setResumeInformation((prev) => ({
          ...prev,
          [sections.workExp]: {
            id: sections.workExp,
            sectionTitle: sections.workExp,
            details: [],
          },
        }));
      } else {
        delete sections.workExp;
        delete resumeInformation.workExp;
        setResumeInformation(resumeInformation);
      }
      setShowExperience(event.target.checked);
    },
    [showExperince]
  );

  const handleOnClickNavLink = (id) => {
    setActiveTabId(id);
  };

  return (
    <div className={styles.container}>
      <p className={styles.heading}>Resume Builder</p>
      <div className={styles.toolbar}>
        <div className={styles.colors}>
          <div className={styles.select}>
            <input
              type="radio"
              value={InternalProfile.title}
              name="profile"
              defaultChecked
              onChange={(e) => handleRadioButton(e)}
              id="internal-profile"
            />
            <label htmlFor="internal-profile">
              {InternalProfile.title} PROFILE
            </label>

            <input
              type="radio"
              value={ExternalProfile.title}
              name="profile"
              onChange={(e) => handleRadioButton(e)}
              id="external-profile"
            />
            <label htmlFor="external-profile">
              {ExternalProfile.title} PROFILE
            </label>
          </div>
          <div className={styles.checkExperince}>
            <input
              type="checkbox"
              value={showExperince}
              onChange={(event) => ShowExperience(event)}
              id="show-experience"
            />
            <label htmlFor="show-experience">
              Do You Want to include Work Experience ?
            </label>
          </div>
          <div className={styles.checkExperince}>
            <input
              type="checkbox"
              value={showCertification}
              onChange={(event) => ShowCertifications(event)}
              id="show-certifications"
            />
            <label htmlFor="show-certifications">
              Do You Want to include Certifications ?
            </label>
          </div>
        </div>

        <ReactToPrint
          trigger={() => {
            return (
              <button type="button" class="btn btn-primary">
                Download <ArrowDown />
              </button>
            );
          }}
          content={() => resumeRef.current}
        />
      </div>
      <div className={styles.main}>
        <Nav tabs justified>
          <NavItem>
            <NavLink
              href={`#${ProfileDetailsTabId}`}
              active={activeTabId === ProfileDetailsTabId}
              onClick={() => handleOnClickNavLink(ProfileDetailsTabId)}
            >
              Profile Details
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href={`#${ResumePreviewTabId}`}
              active={activeTabId === ResumePreviewTabId}
              onClick={() => handleOnClickNavLink(ResumePreviewTabId)}
            >
              Resume Preview
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTabId}>
          <TabPane tabId="profile-details">
            <Editor
              sections={sections}
              information={resumeInformation}
              setInformation={setResumeInformation}
              profile={profile}
            />
          </TabPane>
          <TabPane tabId="preview">
            <Resume
              ref={resumeRef}
              sections={sections}
              information={resumeInformation}
              activeColor={profile.color}
              profile={profile.title}
              showExperince={showExperince}
              showCertification={showCertification}
            />
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default Body;

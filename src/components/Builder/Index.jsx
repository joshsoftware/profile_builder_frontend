import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Col, Row, Space, Switch, Tabs, Typography } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  achievementApi,
  useGetAchievementsQuery,
} from "../../api/achievementApi";
import {
  certificationApi,
  useGetCertificatesQuery,
} from "../../api/certificationApi";
import { useGetEducationsQuery } from "../../api/educationApi";
import { useGetExperiencesQuery } from "../../api/experienceApi";
import { useGetBasicInfoQuery } from "../../api/profileApi";
import { useGetProjectQuery } from "../../api/projectApi";
import {
  ACHIEVEMENT_KEY,
  ACHIEVEMENT_LABEL,
  ACHIEVEMENT_TAG_TYPES,
  BASIC_INFO_KEY,
  BASIC_INFO_LABEL,
  CERTIFICATE_TAG_TYPES,
  CERTIFICATION_KEY,
  CERTIFICATION_LABEL,
  EDUCATION_KEY,
  EDUCATION_LABEL,
  EXPERIENCE_KEY,
  EXPERIENCE_LABEL,
  PROFILES,
  PROJECTS_KEY,
  PROJECTS_LABEL,
} from "../../Constants";
import Navbar from "../Navbar/navbar";
import Resume from "../Resume";
import Achievement from "./Achievement";
import BasicInfo from "./BasicInfo";
import styles from "./Builder.module.css";
import Certification from "./Certification";
import Education from "./Education";
import Experience from "./Experience";
import Project from "./Project";

const createPanes = (
  profileData,
  projectData,
  experienceData,
  educationData,
  disableTabs
) => [
  {
    key: BASIC_INFO_KEY,
    label: BASIC_INFO_LABEL,
    children: <BasicInfo profileData={profileData} />,
  },
  {
    key: PROJECTS_KEY,
    label: PROJECTS_LABEL,
    children: <Project projectData={projectData} />,
    disabled: disableTabs,
  },
  {
    key: EDUCATION_KEY,
    label: EDUCATION_LABEL,
    children: <Education educationData={educationData} />,
    disabled: disableTabs,
  },
  {
    key: EXPERIENCE_KEY,
    label: EXPERIENCE_LABEL,
    children: <Experience experienceData={experienceData} />,
    disabled: disableTabs,
  },
];

const achievement = (achievementData, disableTabs) => ({
  key: ACHIEVEMENT_KEY,
  label: ACHIEVEMENT_LABEL,
  children: <Achievement achievementData={achievementData} />,
  disabled: disableTabs,
});

const certification = (certificationData, disableTabs) => ({
  key: CERTIFICATION_KEY,
  label: CERTIFICATION_LABEL,
  children: <Certification certificationData={certificationData} />,
  disabled: disableTabs,
});

export const Editor = () => {
  const resumeRef = useRef();
  const { profile_id } = useParams();
  const dispatch = useDispatch();
  const [items, setItems] = useState(createPanes(null, null, null, null, true));
  const [profiles, setProfiles] = useState(PROFILES.internal);
  const [showCertification, setShowCertification] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);

  const { data } = useGetBasicInfoQuery(profile_id ?? skipToken);
  const { data: projectData } = useGetProjectQuery(profile_id ?? skipToken);
  const { data: experienceData } = useGetExperiencesQuery(
    profile_id ?? skipToken
  );
  const { data: educationData } = useGetEducationsQuery(
    profile_id ?? skipToken
  );
  const { data: achievementData } = useGetAchievementsQuery(
    profile_id ?? skipToken
  );
  const { data: certificationData } = useGetCertificatesQuery(
    profile_id ?? skipToken
  );

  useEffect(() => {
    if (profile_id) {
      if (data) {
        setItems(
          createPanes(data, projectData, experienceData, educationData, false)
        );
      }
    } else {
      setItems(createPanes(null, null, null, null, true));
    }
  }, [profile_id, data, projectData, experienceData, educationData]);

  useEffect(() => {
    if (showAchievement) {
      dispatch(achievementApi.util.invalidateTags(ACHIEVEMENT_TAG_TYPES));
    }
    if (showCertification) {
      dispatch(certificationApi.util.invalidateTags(CERTIFICATE_TAG_TYPES));
    }
  }, [dispatch, showAchievement, showCertification]);

  const onChange = () => {};

  const onProfileChange = (event) => {
    const selectedProfile = Object.values(PROFILES).find(
      (profile) => profile.title === event.target.value
    );

    if (selectedProfile) {
      setProfiles(selectedProfile);
    }
  };

  const handleTabs = (event, tabName) => {
    let updatedItems;

    if (tabName === ACHIEVEMENT_KEY) {
      setShowAchievement(event);
      updatedItems = event
        ? [...items, achievement(achievementData, !profile_id)]
        : items.filter((item) => item.key !== ACHIEVEMENT_KEY);
    } else if (tabName === CERTIFICATION_KEY) {
      setShowCertification(event);
      updatedItems = event
        ? [...items, certification(certificationData, !profile_id)]
        : items.filter((item) => item.key !== CERTIFICATION_KEY);
    }

    setItems(updatedItems);
  };

  const handleAchievement = (event) => {
    handleTabs(event, ACHIEVEMENT_KEY);
  };

  const handleCertification = (event) => {
    handleTabs(event, CERTIFICATION_KEY);
  };

  return (
    <>
      <Navbar />
      <Row>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          className={styles["hide-scrollbar"]}
          style={{
            minHeight: "98vh",
            maxHeight: "98vh",
            overflow: "auto",
            padding: "2rem",
            top: "2rem",
          }}
        >
          <Typography.Title
            level={2}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            Resume Builder
          </Typography.Title>
          <hr />

          <Space direction="vertical">
            <Space>
              <Switch size="small" onChange={handleAchievement} />
              <Typography.Text>
                Do you want to include achievements?
              </Typography.Text>
            </Space>
            <Space>
              <Switch size="small" onChange={handleCertification} />
              <Typography.Text>
                Do you want to include certifications?
              </Typography.Text>
            </Space>
          </Space>
          <hr />
          <Tabs
            size="small"
            defaultActiveKey="basic-info"
            items={items}
            onChange={onChange}
          />
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          className={styles["hide-scrollbar"]}
          style={{
            overflow: "auto",
            minHeight: "98vh",
            maxHeight: "98vh",
            padding: "2rem",
            top: "2rem",
          }}
        >
          <Resume
            data={{
              data,
              projectData,
              experienceData,
              educationData,
              achievementData: showAchievement ? achievementData : null,
              certificationData: showCertification ? certificationData : null,
              profiles,
            }}
            ref={resumeRef}
          />
        </Col>
      </Row>
    </>
  );
};

export default Editor;

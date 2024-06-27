import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Radio, Row, Space, Switch, Tabs, Typography } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetBasicInfoQuery } from "../../api/profileApi";
import {
  ACHIEVEMENT_KEY,
  ACHIEVEMENT_LABEL,
  BASIC_INFO_KEY,
  BASIC_INFO_LABEL,
  CERTIFICATION_KEY,
  EDUCATION_KEY,
  EDUCATION_LABEL,
  EXPERIENCE_KEY,
  EXPERIENCE_LABEL,
  PROFILES,
  PROJECTS_KEY,
  PROJECTS_LABEL
} from "../../Constants";
import Navbar from "../Navbar/navbar";
import Resume from "../Resume/Resume";
import Achievement from "./Achievement";
import BasicInfo from "./BasicInfo";
import styles from "./Builder.module.css";
import Certification from "./Certification";
import Education from "./Education";
import Experience from "./Experience";
import Project from "./Project";

const createPanes = (profileData, disableTabs) => [
  {
    key: BASIC_INFO_KEY,
    label: BASIC_INFO_LABEL,
    children: <BasicInfo profileData={profileData} />
  },
  {
    key: PROJECTS_KEY,
    label: PROJECTS_LABEL,
    children: <Project />,
    disabled: disableTabs
  },
  {
    key: EDUCATION_KEY,
    label: EDUCATION_LABEL,
    children: <Education />,
    disabled: disableTabs
  },
  {
    key: EXPERIENCE_KEY,
    label: EXPERIENCE_LABEL,
    children: <Experience />,
    disabled: disableTabs
  }
];

const achievement = (profileData, disableTabs) => ({
  key: ACHIEVEMENT_KEY,
  label: ACHIEVEMENT_LABEL,
  children: <Achievement profileData={profileData} />,
  disabled: disableTabs
});

const certification = (profileData, disableTabs) => ({
  key: CERTIFICATION_KEY,
  label: <b>Certification</b>,
  children: <Certification profileData={profileData} />,
  disabled: disableTabs
});

export const Editor = () => {
  const { profile_id } = useParams();
  const [items, setItems] = useState(createPanes(null, !profile_id));
  const [profile, setProfile] = useState(PROFILES.internal);
  const resumeRef = useRef();
  const [profileData, setProfileData] = useState(null);

  const { data } = useGetBasicInfoQuery(profile_id ?? skipToken);

  useEffect(() => {
    if (profile_id) {
      if (data) {
        setProfileData(data);
        setItems(createPanes(data, false));
      }
    } else {
      setItems(createPanes(null, true));
    }
  }, [profile_id, data]);

  const onChange = (key) => {
    // console.log(key);
  };

  const onProfileChange = (event) => {
    const selectedProfile = Object.values(PROFILES).find(
      (profile) => profile.title === event.target.value
    );

    if (selectedProfile) {
      setProfile(selectedProfile);
    }
  };

  const handleTabs = (event, tabName) => {
    const updatedItems = event
      ? [
          ...items,
          tabName === ACHIEVEMENT_KEY
            ? achievement(profileData, !profile_id)
            : certification(profileData, !profile_id)
        ]
      : items.filter((item) => item.key !== tabName);

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
            minheight: "98vh",
            maxHeight: "98vh",
            overflow: "auto",
            padding: "2rem",
            top: "3rem"
          }}
        >
          <Typography.Title
            level={2}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px"
            }}
          >
            Resume Builder
          </Typography.Title>
          <hr />
          <Radio.Group
            defaultValue={profile.title}
            onChange={onProfileChange}
            buttonStyle="solid"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Radio.Button value={PROFILES.internal.title}>
              Internal Profile
            </Radio.Button>
            <Radio.Button value={PROFILES.external.title}>
              External Profile
            </Radio.Button>
          </Radio.Group>

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
            top: "4rem"
          }}
        >
          <Resume ref={resumeRef} />
        </Col>
      </Row>
    </>
  );
};

export default Editor;

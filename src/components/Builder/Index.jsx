import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Radio, Row, Space, Switch, Tabs, Typography } from "antd";
import { PROFILES } from "../../Constants";
import { get } from "../../services/axios";
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
    key: "basic-info",
    label: <b>Basic Info</b>,
    children: <BasicInfo profileData={profileData} />
  },
  {
    key: "projects",
    label: <b>Projects</b>,
    children: <Project />,
    disabled: disableTabs
  },
  {
    key: "education",
    label: <b>Education</b>,
    children: <Education />,
    disabled: disableTabs
  },
  {
    key: "experience",
    label: <b>Experience</b>,
    children: <Experience />,
    disabled: disableTabs
  }
];

const achievement = (profileData, disableTabs) => ({
  key: "achievement",
  label: <b>Achievement</b>,
  children: <Achievement profileData={profileData} />,
  disabled: disableTabs
});

const certification = (profileData, disableTabs) => ({
  key: "certification",
  label: <b>Certification</b>,
  children: <Certification profileData={profileData} />,
  disabled: disableTabs
});

export const Editor = () => {
  const { id } = useParams();
  const [items, setItems] = useState(createPanes(null, !id));
  const [profile, setProfile] = useState(PROFILES.internal);
  const resumeRef = useRef();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (id) {
      get(`/api/profiles/${id}`)
        .then((response) => {
          setProfileData(response.data);
          setItems(createPanes(response.data, false));
        })
        .catch((error) => {
          console.log("Failed to fetch profile data due to : ", error);
        });
    } else {
      setItems(createPanes(null, true));
    }
  }, [id]);

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
          tabName === "achievement"
            ? achievement(profileData, !id)
            : certification(profileData, !id)
        ]
      : items.filter((item) => item.key !== tabName);

    setItems(updatedItems);
  };

  const handleAchievement = (event) => {
    handleTabs(event, "achievement");
  };

  const handleCertification = (event) => {
    handleTabs(event, "certification");
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

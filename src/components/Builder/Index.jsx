import React, { useState } from "react";
import { Col, Radio, Row, Space, Switch, Tabs, Typography } from "antd";
import { PROFILES } from "../../Constants";
import Resume from "../Resume/Resume";
import BasicInfo from "./BasicInfo";
import styles from "./Builder.module.css";
import Certification from "./Certification";
import Education from "./Education";
import Experience from "./Experience";
import Project from "./Project";
import Skills from "./Skills";

const defaultPanes = [
  {
    key: "basic-info",
    label: <b>Basic Info</b>,
    children: <BasicInfo />,
  },
  {
    key: "projects",
    label: <b>Projects</b>,
    children: <Project />,
  },
  {
    key: "education",
    label: <b>Education</b>,
    children: <Education />,
  },
  {
    key: "skills",
    label: <b>Skills</b>,
    children: <Skills />,
  },
];

const experience = {
  key: "experience",
  label: <b>Experience</b>,
  children: <Experience />,
};

const certification = {
  key: "certification",
  label: <b>Certification</b>,
  children: <Certification />,
};

export const Editor = () => {
  const [items, setItems] = useState(defaultPanes);
  const [profile, setProfile] = useState(PROFILES.internal);

  const onChange = (key) => {
    console.log(key);
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
      ? [...items, tabName === "experience" ? experience : certification]
      : items.filter((item) => item.key !== tabName);

    setItems(updatedItems);
  };

  const handleExperience = (event) => {
    handleTabs(event, "experience");
  };

  const handleCertification = (event) => {
    handleTabs(event, "certification");
  };

  return (
    <Row
      style={{
        display: "flex",
        gap: "60px",
        justifyContent: "center",
      }}
    >
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 12 }}
        lg={{ span: 10 }}
        // span={10}
        className={styles["hide-scrollbar"]}
        style={{
          minheight: "98vh",
          maxHeight: "98vh",
          overflow: "auto",
          padding: "10px",
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
            <Switch size="small" onChange={handleExperience} />
            <Typography.Text>
              Do you want to include work experience?
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
        lg={{ span: 10 }}
        // span={10}
        className={styles["hide-scrollbar"]}
        style={{
          overflow: "auto",
          minHeight: "98vh",
          maxHeight: "98vh",
        }}
      >
        <Resume />
      </Col>
    </Row>
  );
};

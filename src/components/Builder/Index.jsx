import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Radio, Row, Space, Switch, Tabs, Typography, message } from "antd";
import BasicInfo from "./BasicInfo";
import Project from "./Project";
import Achievement from "./Achievement";
import Education from "./Education";
import Experience from "./Experience";
import Certification from "./Certification";
import { get } from "../../services/axios";
import { PROFILES } from "../../Constants";

const createPanes = (profileData, disableTabs) => [
  {
    key: "basic-info",
    label: <b>Basic Info</b>,
    children: <BasicInfo profileData={profileData} />,
  },
  {
    key: "projects",
    label: <b>Projects</b>,
    children: <Project />,
    disabled: disableTabs,
  },
  {
    key: "education",
    label: <b>Education</b>,
    children: <Education />,
    disabled: disableTabs,
  },
  {
    key: "experience",
    label: <b>Experience</b>,
    children: <Experience />,
    disabled: disableTabs,
  },
];

const achievement = (profileData, disableTabs) => ({
  key: "achievement",
  label: <b>Achievement</b>,
  children: <Achievement profileData={profileData} />,
  disabled: disableTabs,
});

const certification = (profileData, disableTabs) => ({
  key: "certification",
  label: <b>Certification</b>,
  children: <Certification profileData={profileData} />,
  disabled: disableTabs,
});

export const Editor = () => {
  const { id } = useParams();
  const [items, setItems] = useState(createPanes(null, !id));
  const [profile, setProfile] = useState(PROFILES.internal);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (id) {
      get(`/api/profiles/${id}`)
        .then(response => {
          setProfileData(response.data);
          setItems(createPanes(response.data, false));
        })
        .catch(error => {
          message.error("Failed to fetch profile data due to : ", error);
        });
    } else {
      setItems(createPanes(null, true));
    }
  }, [id]);

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
      ? [...items, tabName === "achievement" ? achievement(profileData, !id) : certification(profileData, !id)]
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
    <Row>
      <Col span={10} offset={7}>
        <Typography.Title
          level={2}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          Profile Builder
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
            <Switch size="small" onChange={handleAchievement} disabled={!id} />
            <Typography.Text>
              Do you want to include achievements?
            </Typography.Text>
          </Space>
          <Space>
            <Switch size="small" onChange={handleCertification} disabled={!id} />
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
    </Row>
  );
};

export default Editor;

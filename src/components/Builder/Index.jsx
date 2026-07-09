import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Col, Row, Space, Spin, Switch, Tabs, Typography } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetAchievementsQuery } from "../../api/achievementApi";
import { useGetCertificatesQuery } from "../../api/certificationApi";
import { useGetEducationsQuery } from "../../api/educationApi";
import { useGetExperiencesQuery } from "../../api/experienceApi";
import { useCreateFullProfileMutation,useGetBasicInfoQuery } from "../../api/profileApi";
import { useGetProjectQuery } from "../../api/projectApi";
import {
  ACHIEVEMENT_KEY,
  ACHIEVEMENT_LABEL,
  BASIC_INFO_KEY,
  BASIC_INFO_LABEL,
  CERTIFICATION_KEY,
  CERTIFICATION_LABEL,
  EDITOR_PROFILE_ROUTE,
  EDUCATION_KEY,
  EDUCATION_LABEL,
  EXPERIENCE_KEY,
  EXPERIENCE_LABEL,
  LOADING_SPIN,
  PROJECTS_KEY,
  PROJECTS_LABEL,
  SPIN_SIZE,
  SUCCESS_TOASTER,
} from "../../Constants";
import { filterSection, formatEducationFields, formatProjectsFields } from "../../helpers";
import Navbar from "../Navbar";
import Resume from "../Resume";
import Achievement from "./Achievement";
import BasicInfo from "./BasicInfo";
import styles from "./Builder.module.css";
import Certification from "./Certification";
import Education from "./Education";
import Experience from "./Experience";
import Project from "./Project";

const createPanes = (
  profile_id,
  profileData,
  projectData,
  experienceData,
  educationData,
  setLiveProfileData,
  setLiveProjectData,
  setLiveExperienceData,
  setLiveEducationData,
  intranetData,
  isIntranetSync,
  handleFullProfileCreate,
  projectFormRef,
  educationFormRef
) => [
  {
    key: BASIC_INFO_KEY,
    label: BASIC_INFO_LABEL,
    children: <BasicInfo profileData={profileData} onLiveChange={setLiveProfileData} onCreateFullProfile={handleFullProfileCreate} />,
  },
  {
    key: PROJECTS_KEY,
    label: PROJECTS_LABEL,
    disabled: !profile_id && !(intranetData?.projects?.length > 0),
    forceRender: isIntranetSync,
    children: <Project projectData={projectData} onLiveChange={setLiveProjectData} intranetData={intranetData} isIntranetSync={isIntranetSync} ref={projectFormRef} />,
  },
  {
    key: EDUCATION_KEY,
    label: EDUCATION_LABEL,
    disabled: !profile_id && !intranetData?.qualification,
    forceRender: isIntranetSync,
    children: <Education educationData={educationData} onLiveChange={setLiveEducationData} intranetData={intranetData} ref={educationFormRef} />,
  },
  {
    key: EXPERIENCE_KEY,
    label: EXPERIENCE_LABEL,
    disabled: !profile_id,
    children: <Experience experienceData={experienceData} onLiveChange={setLiveExperienceData} />,
  },
];

const achievement = (profile_id, achievementData, setLiveAchievementData) => ({
  key: ACHIEVEMENT_KEY,
  label: ACHIEVEMENT_LABEL,
  disabled: !profile_id,
  children: <Achievement achievementData={achievementData} onLiveChange={setLiveAchievementData} />,
});

const certification = (profile_id, certificationData, setLiveCertificationData) => ({
  key: CERTIFICATION_KEY,
  label: CERTIFICATION_LABEL,
  disabled: !profile_id,
  children: <Certification certificationData={certificationData} onLiveChange={setLiveCertificationData} />,
});

export const Editor = () => {
  const resumeRef = useRef();
  const projectFormRef = useRef();
  const educationFormRef = useRef();
  const { profile_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const intranetData = location.state?.intranetData;
  const isIntranetSync = !!intranetData && !profile_id;
  const [createFullProfile] = useCreateFullProfileMutation();
  
  const [liveProfileData, setLiveProfileData] = useState(null);
  const [liveProjectData, setLiveProjectData] = useState(null);
  const [liveExperienceData, setLiveExperienceData] = useState(null);
  const [liveEducationData, setLiveEducationData] = useState(null);
  const [liveAchievementData, setLiveAchievementData] = useState(null);
  const [liveCertificationData, setLiveCertificationData] = useState(null);

  const handleFullProfileCreate = async (basicInfoValues) => {
    const payload = {
        profile: basicInfoValues,
    };

    if (intranetData?.qualification && educationFormRef.current) {
        try {
            const eduValues = educationFormRef.current.getFieldsValue();
            const filteredEdu = filterSection(eduValues);
            const educations = formatEducationFields(filteredEdu);
            if (educations.length > 0) {
                payload.educations = educations;
            }
        } catch (e) { /* Education is optional */ }
    }

    if (intranetData?.projects?.length > 0 && projectFormRef.current) {
        try {
            const projValues = projectFormRef.current.getFieldsValue();
            const filteredProj = filterSection(projValues);
            const projects = formatProjectsFields(filteredProj);
            if (projects.length > 0) {
                payload.projects = projects;
            }
        } catch (e) { /* Projects are optional */ }
    }

    try {
        const response = await createFullProfile(payload).unwrap();
        if (response?.message) {
            toast.success(response.message, SUCCESS_TOASTER);
            navigate(
                EDITOR_PROFILE_ROUTE.replace(":profile_id", response.profile_id)
            );
        }
    } catch (error) {
        toast.error(error?.data?.error_message || "Failed to create profile");
    }
  };

  const [items, setItems] = useState(createPanes(profile_id, null, null, null, null, setLiveProfileData, setLiveProjectData, setLiveExperienceData, setLiveEducationData, intranetData, isIntranetSync, handleFullProfileCreate, projectFormRef, educationFormRef));
  const [showCertification, setShowCertification] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);

  const { data: profileData, isLoading: isGettingBasicInfo } =
    useGetBasicInfoQuery(profile_id ?? skipToken);
  const { data: projectData, isLoading: isGettingProjects } =
    useGetProjectQuery(profile_id ?? skipToken);
  const { data: experienceData, isLoading: isGettingExperiences } =
    useGetExperiencesQuery(profile_id ?? skipToken);
  const { data: educationData, isLoading: isGettingEducations } =
    useGetEducationsQuery(profile_id ?? skipToken);
  const { data: achievementData, isLoading: isGettingAchievements } =
    useGetAchievementsQuery(profile_id ?? skipToken);
  const { data: certificationData, isLoading: isGettingCertificates } =
    useGetCertificatesQuery(profile_id ?? skipToken);

  useEffect(() => {
    if (profile_id) {
      setLiveProfileData(profileData);
      setLiveProjectData(projectData);
      setLiveExperienceData(experienceData);
      setLiveEducationData(educationData);
      setLiveAchievementData(achievementData);
      setLiveCertificationData(certificationData);
      setItems(
        createPanes(
          profile_id,
          profileData,
          projectData,
          experienceData,
          educationData,
          setLiveProfileData,
          setLiveProjectData,
          setLiveExperienceData,
          setLiveEducationData,
          intranetData,
          isIntranetSync,
          handleFullProfileCreate,
          projectFormRef,
          educationFormRef
        ),
      );
    } else {
      setItems(createPanes(profile_id, null, null, null, null, setLiveProfileData, setLiveProjectData, setLiveExperienceData, setLiveEducationData, intranetData, isIntranetSync, handleFullProfileCreate, projectFormRef, educationFormRef));
    }
  }, [profile_id, profileData, projectData, experienceData, educationData, achievementData, certificationData, intranetData, isIntranetSync]);

  const handleTabs = (event, tabName) => {
    let updatedItems;

    if (tabName === ACHIEVEMENT_KEY) {
      setShowAchievement(event);
      updatedItems = event
        ? [...items, achievement(profile_id, achievementData, setLiveAchievementData)]
        : items.filter((item) => item.key !== ACHIEVEMENT_KEY);
    } else if (tabName === CERTIFICATION_KEY) {
      setShowCertification(event);
      updatedItems = event
        ? [...items, certification(profile_id, certificationData, setLiveCertificationData)]
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
      <Spin
        tip={LOADING_SPIN}
        size={SPIN_SIZE}
        spinning={
          isGettingBasicInfo &&
          isGettingProjects &&
          isGettingEducations &&
          isGettingExperiences &&
          isGettingAchievements &&
          isGettingCertificates
        }
        className={styles.spin}
      >
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
              Profile Builder
            </Typography.Title>
            <hr />

            <Space direction="vertical">
              <Space>
                <Switch size="small" onChange={handleAchievement} disabled={!profile_id} />
                <Typography.Text>
                  Do you want to include achievements?
                </Typography.Text>
              </Space>
              <Space>
                <Switch size="small" onChange={handleCertification} disabled={!profile_id} />
                <Typography.Text>
                  Do you want to include certifications?
                </Typography.Text>
              </Space>
            </Space>
            <hr />
            <Tabs size="small" defaultActiveKey="basic-info" items={items} />
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
                profileData: liveProfileData,
                projectData: liveProjectData,
                experienceData: liveExperienceData,
                educationData: liveEducationData,
                achievementData: showAchievement ? liveAchievementData : null,
                certificationData: showCertification ? liveCertificationData : null,
              }}
              ref={resumeRef}
            />
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default Editor;

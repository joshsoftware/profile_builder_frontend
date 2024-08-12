import React, { forwardRef, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button, Dropdown, Menu, Tag } from "antd";
import {
  CalendarOutlined,
  CheckOutlined,
  CheckSquareOutlined,
  DownloadOutlined,
  DownOutlined,
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useCompleteProfileMutation } from "../../api/profileApi";
import joshImage from "../../assets/Josh-Logo-White-bg.svg";
import {
  getMonthString,
  PRESENT_VALUE,
  ROOT_ROUTE,
  SUCCESS_TOASTER,
} from "../../Constants";
import { calculateTotalExperience, showConfirm } from "../../helpers";
import styles from "./Resume.module.css";

const Resume = forwardRef(({ data }, ref) => {
  const role = useSelector((state) => state.auth.role);
  const [completeProfileService] = useCompleteProfileMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const { is_josh_employee } = location.state || {};

  Resume.propTypes = {
    data: PropTypes.object.isRequired,
  };
  const {
    profileData: profile,
    projectData: projects,
    experienceData: experiences,
    educationData: educations,
    achievementData: achievements,
    certificationData: certifications,
  } = data;

  const containerRef = useRef();
  const [columns, setColumns] = useState([[], []]);
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  const getMonthYear = (value) => {
    if (!value) {
      return;
    }
    const date = new Date(value);
    const currDate = new Date();

    const givenYear = date.getFullYear();
    const givenMonth = date.getMonth();

    if (
      givenYear === currDate.getFullYear() &&
      givenMonth === currDate.getMonth()
    ) {
      return PRESENT_VALUE;
    }
    return ` ${getMonthString(givenMonth)} ${givenYear}   `;
  };

  const sectionDiv = {
    experiences: (
      <div
        key={"experiences"}
        className={`${styles.section} pb-2 ${
          experiences?.length > 0 ? "" : styles.hidden
        } `}
      >
        <div className={styles.separateRight}></div>
        <div className={styles.sectionTitle}>Experiences</div>
        <div className={styles.content}>
          {experiences?.map((item) => (
            <div className={styles.item} key={item.id}>
              {item?.designation && (
                <div className={styles.title}>{item.designation}</div>
              )}
              {item?.company_name && (
                <div className={styles.date}>
                  <span className={styles.subtitle}>{item.company_name}</span>
                  | <CalendarOutlined /> {getMonthYear(item.from_date)} -
                  {item.to_date === PRESENT_VALUE ? " Present" : item.to_date}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    projects: (
      <div
        key={"projects"}
        className={`${styles.section} pb-3 ${
          projects?.length > 0 ? "" : styles.hidden
        }`}
      >
        <div className={styles.separateRight}></div>
        <div className={styles.sectionTitle}>Projects</div>
        <div className={styles.content}>
          {projects?.map((item) => (
            <div className={styles.item} key={item.id}>
              {item?.name && (
                <h2 className={styles.title}>
                  <b className={styles.underline}>{item.name}</b>
                  {item?.working_start_date && item?.working_end_date && (
                    <span className="px-2">
                      | {getMonthYear(item.working_start_date)} -
                      {getMonthYear(item.working_end_date)}
                    </span>
                  )}
                </h2>
              )}

              {item?.duration && (
                <span className={styles.duration}>
                  <b className={styles.overview}>Duration : </b>
                  {item.duration}
                </span>
              )}
              {item?.description && (
                <div>
                  <span className={styles.duration}>
                    <b className={styles.overview}>Project Description: </b>
                    <span style={{ whiteSpace: "pre-line" }}>
                      {item.description}
                    </span>
                  </span>
                </div>
              )}
              {item?.role && (
                <span className={styles.duration}>
                  <b className={styles.overview}>Role : </b>
                  <ul>
                    {item.role.split("\n").map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                </span>
              )}
              {item?.responsibilities && (
                <span className={styles.duration}>
                  <b className={styles.overview}>Responsibility : </b>
                  <ul>
                    {item.responsibilities.split("\n").map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                </span>
              )}
              {item?.technologies && (
                <span className={styles.duration}>
                  <b className={styles.overview}>Project Techstack : </b>
                  {Array.isArray(item.technologies)
                    ? item.technologies.join(", ")
                    : item.technologies}
                </span>
              )}
              {item?.tech_worked_on && (
                <span className={styles.duration}>
                  <b className={styles.overview}>Technology Worked On : </b>
                  {Array.isArray(item.tech_worked_on)
                    ? item.tech_worked_on.join(", ")
                    : item.tech_worked_on}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    achievements: (
      <div
        key={"achievements"}
        className={`${styles.section} ${
          achievements?.length > 0 ? "" : styles.hidden
        }`}
      >
        <div className={styles.separate}></div>
        <div className={`${styles.leftSection} pt-2`}>Achievements</div>
        <div className={styles.title} style={{ textAlign: "right" }}>
          <ul className={styles.achievement}>
            {achievements?.map((item) => (
              <li key={item.id}>{item?.name && <span>• {item.name}</span>}</li>
            ))}
          </ul>
        </div>
      </div>
    ),
    educations: (
      <div
        key={"education"}
        className={`${styles.section} pb-2 ${
          educations?.length > 0 ? "" : styles.hidden
        } `}
      >
        <div className={styles.separate}></div>
        <div className={`${styles.leftSection} pt-2`}>Educations</div>
        <div className={styles.content}>
          {educations?.map((item) => (
            <div className={styles.educationItem} key={item.id}>
              {item?.degree && (
                <p className={styles.subtitleHeading}>{item.degree}</p>
              )}
              {(item?.university_name || item?.place) && (
                <div className={styles.subtitle}>
                  {item.university_name} {item.place && `, ${item.place}`}
                </div>
              )}
              {item?.passing_year && (
                <div className={styles.passingDate}>
                  Passing Year : {new Date(item.passing_year).getFullYear()}
                </div>
              )}
              {item?.percent_or_cgpa && (
                <div className={styles.passingDate}>
                  CGPA / Percentage : {item.percent_or_cgpa}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    skills: (
      <div
        key={"skills"}
        className={`${styles.section} ${
          profile?.primary_skills?.length > 0 ||
          profile?.secondary_skills?.length > 0
            ? ""
            : styles.hidden
        }`}
      >
        <div className={styles.leftSection}>Skills</div>
        <div className={styles.content}>
          <div className={styles.educationItem}>
            {profile?.primary_skills?.length > 0 && (
              <div>
                <div className={styles.subtitleHeading}>Primary Skills</div>
                <ul className={styles.skillNumbered}>
                  {profile?.primary_skills?.map((elem, index) => (
                    <Tag
                      color="blue"
                      key={"primary" + elem + index}
                      style={{ margin: "1px" }}
                    >
                      {elem}
                    </Tag>
                  ))}
                </ul>
              </div>
            )}
            {profile?.secondary_skills?.length > 0 && (
              <div>
                <div className={styles.subtitleHeading}>Secondary Skills</div>
                <ul className={styles.skillNumbered}>
                  {profile?.secondary_skills?.map((elem, index) => (
                    <Tag
                      color="blue"
                      key={"secondary" + elem + index}
                      style={{ margin: "1px" }}
                    >
                      {elem}
                    </Tag>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    certifications: (
      <div
        key={"certifications"}
        className={`${styles.section} ${
          certifications?.length > 0 ? "" : styles.hidden
        }`}
      >
        <div className={styles.separate}></div>
        <div className={`${styles.leftSection} pt-2`}>Certifications</div>
        <div className={styles.content}>
          {certifications?.map((item) => (
            <div className={styles.educationItem} key={item.id}>
              {item?.name && (
                <p className={styles.subtitleHeading}>{item.name}</p>
              )}
              {item?.organization_name && (
                <div className={styles.subtitle}>{item.organization_name}</div>
              )}
              {item?.issued_date && (
                <div className={styles.passingDate}>
                  Issue Date : {item.issued_date}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  };

  //At component mount which section of resume contains which tab details.
  useEffect(() => {
    const leftColumn = [
      "skills",
      "educations",
      certifications ? "certifications" : null,
      achievements ? "achievements" : null,
    ].filter(Boolean);

    const rightColumn = ["experiences", "projects"].filter(Boolean);
    setColumns([leftColumn, rightColumn]);
  }, [achievements, certifications]);

  //Whenever active colour changes from Body component then this effect will be called.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const color = is_josh_employee === "NO" ? "#062e38" : "#35549c";
    container.style.setProperty("--color", color);
  }, [is_josh_employee]);

  const getPageMargins = () => {
    return `@page { margin: ${"1rem"} ${"0"} ${"1rem"} ${"0"} !important }`;
  };

  const downloadMenu = (
    <Menu>
      <Menu.Item key="1" onClick={handlePrint}>
        Download as PDF
      </Menu.Item>
      {/* <Menu.Item key="2" onClick={handleDownload}>
        Download as DOCX
      </Menu.Item> */}
    </Menu>
  );

  const handleCompleteProfile = () => {
    showConfirm({
      onOk: async () => {
        try {
          if (profile?.id) {
            const response = await completeProfileService({
              profile_id: profile?.id,
            });
            if (response?.data) {
              toast.success(response?.data?.message, SUCCESS_TOASTER);
              navigate(ROOT_ROUTE);
            }
          }
        } catch (error) {
          toast.error(error.response?.data?.message);
        }
      },
      onCancel() {},
      message:
        "Are you certain you want to finalize the profile? Once completed, changes cannot be undone.",
    });
  };

  return (
    <>
      <div className="header" style={{ marginTop: "10px" }}>
        {role.toLowerCase() === "admin" ? (
          <Dropdown overlay={downloadMenu} trigger={["click"]}>
            <Button type="primary" icon={<DownloadOutlined />}>
              Download <DownOutlined />
            </Button>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleCompleteProfile}
          >
            Complete Profile
          </Button>
        )}
      </div>
      <div ref={ref}>
        <style>{getPageMargins()}</style>
        <div ref={containerRef} className={styles.container}>
          <div className={styles.header}>
            <p className={styles.heading}>{profile?.name}</p>
            <div className={styles.subHeading}>
              {profile?.designation && (
                <span className="px-1">{profile?.designation}</span>
              )}
              {profile?.gender && (
                <span className="px-1">({profile?.gender})</span>
              )}
            </div>
            <div className={styles.experienceHeading}>
              {profile?.years_of_experience && (
                <div>
                  <CheckSquareOutlined />{" "}
                  <span>
                    {calculateTotalExperience(
                      profile?.years_of_experience,
                      profile?.josh_joining_date,
                    )}
                    + Years of Experience
                  </span>
                </div>
              )}
              {profile?.email && (
                <div>
                  <MailOutlined /> {profile?.email}
                </div>
              )}
              {profile?.mobile && (
                <div>
                  <MobileOutlined /> {profile?.mobile}
                </div>
              )}
              <div className={styles.socialLink}>
                {profile?.github_link && (
                  <>
                    <GithubOutlined />{" "}
                    <Link target="_blank" to={profile?.github_link}>
                      GitHub
                    </Link>{" "}
                  </>
                )}
                {profile?.linkedin_link && (
                  <>
                    <LinkedinOutlined />{" "}
                    <Link target="_blank" to={profile?.linkedin_link}>
                      LinkedIn
                    </Link>
                  </>
                )}
              </div>
            </div>
            <img
              src={joshImage}
              alt="Not Found"
              width={250}
              height={180}
              className={styles.logo}
            />
          </div>

          <div className="container">
            <div className="row pr-2">
              <div className={`col-3 pb-5 ${styles.middleSeparatorLine}`}>
                {columns[0].map((item) => sectionDiv[item])}
              </div>
              <div className="col-9 mr-5">
                {profile?.description && (
                  <div>
                    <div>
                      <h4>
                        <b
                          className={`${styles.paddingLeft} ${styles.sectionTitle}`}
                        >
                          Profile
                        </b>
                      </h4>
                    </div>
                    <div className={`${styles.profiledetails} pb-3`}>
                      <span style={{ whiteSpace: "pre-line" }}>
                        {profile?.description}
                      </span>
                    </div>
                  </div>
                )}
                {columns[1].map((item) => sectionDiv[item])}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

Resume.displayName = "Resume";
export default Resume;

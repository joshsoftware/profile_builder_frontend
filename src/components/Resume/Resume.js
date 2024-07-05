import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button, Radio } from "antd";
import {
  CalendarOutlined,
  CheckSquareOutlined,
  DownloadOutlined,
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  MobileOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import joshImage from "../../assets/Josh-Logo-White-bg.svg";
import { genderOptions, getMonthString, PROFILES } from "../../Constants";
import styles from "./Resume.module.css";

const Resume = forwardRef(({ data }, ref) => {
  const [profileType, setProfileType] = useState(PROFILES.internal);
  Resume.propTypes = {
    data: PropTypes.object.isRequired
  };
  const {
    data: profile,
    projectData: projects,
    experienceData: experiences,
    educationData: educations,
    achievementData: achievements,
    certificationData: certifications,
    profiles
  } = data;

  const containerRef = useRef();
  const [columns, setColumns] = useState([[], []]);
  const hadlePrint = useReactToPrint({
    content: () => ref.current
  });

  const onProfileChange = (event) => {
    const selectedProfile = Object.values(PROFILES).find(
      (profile) => profile.title === event.target.value
    );

    if (selectedProfile) {
      setProfileType(selectedProfile);
    }
  };

  const getFormattedDate = (value) => {
    if (!value) {
      return "";
    }
    const date = new Date(value);
    const todayDate = new Date();

    const givenDate = date.getDate();
    const givenMonth = date.getMonth() + 1;
    const givenYear = date.getFullYear();
    if (
      todayDate.getDate() === givenDate &&
      todayDate.getMonth() + 1 === givenMonth &&
      todayDate.getFullYear() === givenYear
    ) {
      return "Present";
    } else {
      return `${givenDate}/${givenMonth}/${givenYear}`;
    }
  };

  const getPassingYear = (value) => {
    if (!value) {
      return "";
    }
    const date = new Date(value);

    const givenYear = date.getFullYear();

    return givenYear;
  };

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
      return " Present";
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
                  {getMonthYear(item.to_date)}
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
                    <b className={styles.overview}>Project Description : </b>
                    {item.description}
                  </span>
                </div>
              )}
              {item?.role && (
                <span className={styles.duration}>
                  <b className={styles.overview}>Role : </b>
                  {item.role}
                </span>
              )}
              {item?.responsibilities && (
                <span className={styles.duration}>
                  <b className={styles.overview}>Responsibility : </b>
                  {item.responsibilities}
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
                  <b className={styles.overview}>My Contribution : </b>
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
                  {item.university_name} , {item.place}
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
                  {profile?.primary_skills.map((elem, index) => (
                    <li className={styles.point} key={"primary" + elem + index}>
                      {elem}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {profile?.secondary_skills?.length > 0 && (
              <div>
                <div className={styles.subtitleHeading}>Secondary Skills</div>
                <ul className={styles.skillNumbered}>
                  {profile?.secondary_skills?.map((elem, index) => (
                    <li
                      className={styles.point}
                      key={"secondary" + elem + index}
                    >
                      {elem}
                    </li>
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
    )
  };

  //At component mount which section of resume contains which tab details.
  useEffect(() => {
    const leftColumn = [
      "skills",
      "educations",
      certifications ? "certifications" : null,
      achievements ? "achievements" : null
    ].filter(Boolean);

    const rightColumn = ["experiences", "projects"].filter(Boolean);
    setColumns([leftColumn, rightColumn]);
  }, [achievements, certifications]);

  //Whenever active colour changes from Body component then this effect will be called.
  useEffect(() => {
    const container = containerRef.current;
    if (!profileType?.color || !container) {
      return;
    }
    container.style.setProperty("--color", profileType?.color);
  }, [profileType]);

  const getPageMargins = () => {
    return `@page { margin: ${"1rem"} ${"0"} ${"1rem"} ${"0"} !important }`;
  };
  return (
    <>
      <Button
        onClick={hadlePrint}
        type="primary"
        icon={<DownloadOutlined />}
        style={{ margin: "10px" }}
      >
        Download
      </Button>
      <Radio.Group
        defaultValue={profiles.title}
        onChange={onProfileChange}
        buttonStyle="solid"
        style={{ marginLeft: "220px" }}
      >
        <Radio.Button value={PROFILES.internal.title}>
          Internal Profile
        </Radio.Button>
        <Radio.Button value={PROFILES.external.title}>
          External Profile
        </Radio.Button>
      </Radio.Group>

      <div ref={ref}>
        <style>{getPageMargins()}</style>
        {/* No we have to change color of text so we are taking container ref.
        to do so we have to modify --color property in styles. */}
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
                  <CheckSquareOutlined /> {profile?.years_of_experience}
                  <span> Year of Experience</span>
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
              <div className={`col-4 pb-5 ${styles.middleSeparatorLine}`}>
                {columns[0].map((item) => sectionDiv[item])}
              </div>
              <div className="col-8 mr-5">
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
                      {profile?.description}
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

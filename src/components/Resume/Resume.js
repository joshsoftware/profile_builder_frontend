import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button } from "antd";
import {
  CalendarOutlined,
  CaretRightOutlined,
  DownloadOutlined,
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  MobileOutlined
} from "@ant-design/icons";
import joshImage from "../../assets/Josh-Logo-White-bg.svg";
import { getMonthString } from "../../Constants";
import jsonData from "./jsonData.json";
import styles from "./Resume.module.css";
//we cannt pass ref directly to component so we should wrap a component in forwardRef.
const Resume = forwardRef((props, ref) => {
  const containerRef = useRef();
  const [columns, setColumns] = useState([[], []]);
  const hadlePrint = useReactToPrint({
    content: () => ref.current
  });
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
          jsonData.experiences?.length > 0 ? "" : styles.hidden
        } `}
      >
        <div className={styles.separateRight}></div>
        <div className={styles.sectionTitle}>Experiences</div>
        <div className={styles.content}>
          {jsonData?.experiences?.map((item) => (
            <div className={styles.item} key={item.id}>
              {item?.designation ? (
                <div className={styles.title}>{item.designation}</div>
              ) : (
                <span />
              )}

              {item?.company_name ? (
                <div className={styles.date}>
                  <span className={styles.subtitle}>{item.company_name}</span>
                  | <CalendarOutlined /> {getMonthYear(item.from_date)} -
                  {getMonthYear(item.to_date)}
                </div>
              ) : (
                <span />
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
          jsonData.projects?.length > 0 ? "" : styles.hidden
        }`}
      >
        <div className={styles.separateRight}></div>
        <div className={styles.sectionTitle}>Projects</div>
        <div className={styles.content}>
          {jsonData.projects?.map((item) => (
            <div className={styles.item} key={item.id}>
              {item?.name ? (
                <h2 className={styles.title}>
                  <b className={styles.underline}>{item.name}</b>
                  {item?.working_start_date && item?.working_end_date ? (
                    <span className="px-2">
                      | {getMonthYear(item.working_start_date)} -
                      {getMonthYear(item.working_end_date)}
                    </span>
                  ) : (
                    <span />
                  )}
                </h2>
              ) : (
                <span />
              )}

              {item?.duration ? (
                <span className={styles.duration}>
                  <b className={styles.overview}>Duration : </b>
                  {item.duration}
                </span>
              ) : (
                <span />
              )}

              {item?.description ? (
                <div>
                  <span className={styles.duration}>
                    <b className={styles.overview}>Project Description : </b>
                    {item.description}
                  </span>
                </div>
              ) : (
                <span />
              )}
              {item?.role ? (
                <span className={styles.duration}>
                  <b className={styles.overview}>Role : </b>
                  {item.role}
                </span>
              ) : (
                <span />
              )}
              {item?.responsibilities ? (
                <span className={styles.duration}>
                  <b className={styles.overview}>Responsibility : </b>
                  {item.responsibilities}
                </span>
              ) : (
                <span />
              )}

              {item?.technologies ? (
                <span className={styles.duration}>
                  <b className={styles.overview}>Project Techstack : </b>
                  {item.technologies}
                </span>
              ) : (
                <span />
              )}
              {item?.tech_worked_on ? (
                <span className={styles.duration}>
                  <b className={styles.overview}>My Contribution : </b>
                  {item.tech_worked_on}
                </span>
              ) : (
                <span />
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
          jsonData.achievements?.length > 0 ? "" : styles.hidden
        }`}
      >
        <div className={styles.separate}></div>
        <div className={`${styles.leftSection} pt-2`}>Achievements</div>
        <div className={styles.title} style={{ textAlign: "right" }}>
          <ul className={styles.achievement}>
            {jsonData.achievements?.map((item) => (
              <li key={item.id}>
                {item?.name ? <span>• {item.name}</span> : <span />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    educations: (
      <div
        key={"education"}
        className={`${styles.section} pb-2 ${
          jsonData.educations?.length > 0 ? "" : styles.hidden
        } `}
      >
        <div className={styles.separate}></div>
        <div className={`${styles.leftSection} pt-2`}>Educations</div>
        <div className={styles.content}>
          {jsonData.educations?.map((item) => (
            <div className={styles.educationItem} key={item.id}>
              {item?.degree ? (
                <p className={styles.subtitleHeading}>{item.degree}</p>
              ) : (
                <span />
              )}
              {item?.university_name || item?.place ? (
                <div className={styles.subtitle}>
                  {item.university_name} , {item.place}
                </div>
              ) : (
                <span />
              )}
              {item?.passing_year ? (
                <div className={styles.passingDate}>
                  Passing Year : {new Date(item.passing_year).getFullYear()}
                </div>
              ) : (
                ""
              )}
              {item?.percent_or_cgpa ? (
                <div className={styles.passingDate}>
                  CGPA / Percentage : {item.percent_or_cgpa}
                </div>
              ) : (
                ""
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
          jsonData.skills?.length > 0 ? "" : styles.hidden
        }`}
      >
        <div className={styles.leftSection}>Skills</div>
        <div className={styles.content}>
          {jsonData.skills?.length > 0 ? (
            <ul className={styles.skillNumbered}>
              {jsonData.skills?.map((elem, index) => (
                <li className={styles.point} key={elem + index}>
                  {elem}
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
        </div>
      </div>
    ),

    certifications: (
      <div
        key={"certifications"}
        className={`${styles.section} ${
          jsonData.certifications?.length > 0 ? "" : styles.hidden
        }`}
      >
        <div className={styles.separate}></div>
        <div className={`${styles.leftSection} pt-2`}>Certifications</div>
        <div className={styles.content}>
          {jsonData.certifications?.map((item) => (
            <div className={styles.educationItem} key={item.id}>
              {item?.name ? (
                <p className={styles.subtitleHeading}>{item.name}</p>
              ) : (
                <span />
              )}
              {item?.organization_name ? (
                <div className={styles.subtitle}>{item.organization_name}</div>
              ) : (
                <span />
              )}
              {item?.issued_date ? (
                <div className={styles.passingDate}>
                  Issue Date : {item.issued_date}
                </div>
              ) : (
                ""
              )}
              {/* {item?.description ? (
                  <div>
                    <b>Description : </b>
                    <p className={styles.overview}>{item.description} </p>
                  </div>
                ) : (
                  <span />
                )} */}
            </div>
          ))}
        </div>
      </div>
    )
  };

  useEffect(() => {
    const leftColumn = [
      "skills",
      "educations",
      jsonData.showCertification ? "certifications" : null,
      jsonData.showAcheivements ? "achievements" : null
    ].filter(Boolean);

    const rightColumn = ["experiences", "projects"].filter(Boolean);
    setColumns([leftColumn, rightColumn]);
  }, []);

  //Whenever active colour changes from Body component then this effect
  // will be called.
  useEffect(() => {
    //to get that container div in which --color property to be changed.
    const container = containerRef.current;
    if (!jsonData.activeColor || !container) {
      return;
    }
    container.style.setProperty("--color", jsonData.activeColor);
  }, []);

  const getPageMargins = () => {
    return `@page { margin: ${"1rem"} ${"0"} ${"1rem"} ${"0"} !important }`;
  };

  return (
    // Passing to be print content ref to reacttopdf component
    <>
      <Button
        onClick={hadlePrint}
        type="primary"
        icon={<DownloadOutlined />}
        style={{ margin: "10px" }}
      >
        Download
      </Button>
      <div ref={ref}>
        <style>{getPageMargins()}</style>
        {/* No we have to change color of text so we are taking container ref.
        to do so we have to modify --color property in styles. */}
        <div ref={containerRef} className={styles.container}>
          <div className={styles.header}>
            <p className={styles.heading}>{jsonData.profile?.name}</p>
            <div className={styles.subHeading}>
              {jsonData.profile?.designation && (
                <span className="px-1">{jsonData.profile?.designation}</span>
              )}
              {jsonData.profile?.gender && (
                <span className="px-1">({jsonData.profile?.gender})</span>
              )}
            </div>
            <div className={styles.experienceHeading}>
              <div>
                <CaretRightOutlined /> {jsonData.profile?.years_of_experience}
                <span> Year of Experience</span>
              </div>
              <div>
                <MailOutlined /> {jsonData.profile?.email}
              </div>
              {jsonData.profile?.mobile && (
                <div>
                  <MobileOutlined /> {jsonData.profile?.mobile}
                </div>
              )}
              <div className={styles.socialLink}>
                {jsonData.profile?.github_link && (
                  <>
                    <GithubOutlined />{" "}
                    <Link target="_blank" to={jsonData.profile?.github_link}>
                      GitHub
                    </Link>{" "}
                  </>
                )}
                {jsonData.profile?.linkedin_link && (
                  <>
                    <LinkedinOutlined />{" "}
                    <Link target="_blank" to={jsonData.profile?.linkedin_link}>
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
                  {jsonData.profile?.description}
                </div>
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

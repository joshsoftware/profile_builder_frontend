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
  const hadlePrint = useReactToPrint({
    content: () => ref.current
  });

  const {
    showExperince = {},
    showCertification = {},
    information = {},
    sections = {},
    profile = {},
    activeColor = {}
  } = jsonData;
  // const information = props.information;
  // const sections = props.sections;
  // const profile = props.profile;
  const containerRef = useRef();

  //which divides an resume into two sections and at mounting tqo section contains which fields are populated.
  const [columns, setColumns] = useState([[], []]);

  const info = {
    profile: information[sections.profile],
    workExp: information[sections.workExp],
    project: information[sections.project],
    education: information[sections.education],
    skills: information[sections.skills],
    certification: information[sections.certification],
    achievements: information[sections.achievements]
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

  //Different section of tabs for Drag and Drop functionality.
  const sectionDiv = {
    [sections.workExp]: (
      <div
        key={"workexp"}
        className={`${styles.section} pb-2 ${
          info.workExp?.sectionTitle ? "" : styles.hidden
        } `}
      >
        <div className={styles.separateRight}></div>
        <div className={styles.sectionTitle}>{info.workExp?.sectionTitle}</div>
        <div className={styles.content}>
          {info?.workExp?.details?.map((item) => (
            <div className={styles.item} key={item.id}>
              {item?.designation || item?.company_name ? (
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

              {/* {item?.points?.length > 0 ? (
                  <ul className={styles.points}>
                    {item.points?.map((elem, index) => (
                      <li className={styles.point} key={elem + index}>
                        {elem}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span />
                )} */}
            </div>
          ))}
        </div>
      </div>
    ),
    [sections.project]: (
      <div
        key={"project"}
        className={`${styles.section} pb-3 ${
          info.project?.sectionTitle ? "" : styles.hidden
        }`}
      >
        <div className={styles.separateRight}></div>
        <div className={styles.sectionTitle}>{info?.project?.sectionTitle}</div>
        <div className={styles.content}>
          {info?.project?.details?.map((item) => (
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
                  {/* <p className={styles.overview}>{item.description} </p> */}
                </div>
              ) : (
                <span />
              )}

              {/* {item?.points?.length > 0 ? (
                  <div>
                    <h6>
                      <b>Roles and Responsibility :</b>{" "}
                    </h6>
                    <ul className={styles.projectPoints}>
                      {item.points?.map((elem, index) => (
                        <li className={styles.point} key={elem + index}>
                          {elem}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <span />
                )} */}

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
    [sections.achievements]: (
      <div
        key={"achievements"}
        className={`${styles.section} ${
          info.achievements?.sectionTitle ? "" : styles.hidden
        }`}
      >
        <div className={styles.separate}></div>
        <div className={`${styles.leftSection} pt-2`}>
          {info.achievements?.sectionTitle}
        </div>
        <div className={styles.title} style={{ textAlign: "right" }}>
          <ul className={styles.achievement}>
            {info?.achievements?.details?.map((item) => (
              <li key={item.id}>
                {item?.name ? <span>• {item.name}</span> : <span />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    [sections.education]: (
      <div
        key={"education"}
        className={`${styles.section} pb-2 ${
          info.education?.sectionTitle ? "" : styles.hidden
        } `}
      >
        <div className={styles.separate}></div>
        <div className={`${styles.leftSection} pt-2`}>
          {info.education?.sectionTitle}
        </div>
        <div className={styles.content}>
          {info?.education?.details?.map((item) => (
            <div className={styles.educationItem} key={item.id}>
              {item.degree ? (
                <p className={styles.subtitleHeading}>{item.degree}</p>
              ) : (
                <span />
              )}
              {item.university_name || item.place ? (
                <div className={styles.subtitle}>
                  {item.university_name} , {item.place}
                </div>
              ) : (
                <span />
              )}
              {item.passing_year ? (
                <div className={styles.passingDate}>
                  Passing Year : {new Date(item.passing_year).getFullYear()}
                </div>
              ) : (
                ""
              )}
              {item.percent_or_cgpa ? (
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
    [sections.skills]: (
      <div
        key={"skills"}
        className={`${styles.section} ${
          info.skills?.sectionTitle ? "" : styles.hidden
        }`}
      >
        <div className={styles.leftSection}>{info.skills?.sectionTitle}</div>
        <div className={styles.content}>
          {info?.skills?.points?.length > 0 ? (
            <ul className={styles.skillNumbered}>
              {info.skills?.points?.map((elem, index) => (
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

    [sections.certification]: (
      <div
        key={"certification"}
        className={`${styles.section} ${
          info.certification?.sectionTitle ? "" : styles.hidden
        }`}
      >
        <div className={styles.separate}></div>
        <div className={`${styles.leftSection} pt-2`}>
          {info.certification?.sectionTitle}
        </div>
        <div className={styles.content}>
          {info?.certification?.details?.map((item) => (
            <div className={styles.educationItem} key={item.id}>
              {item.name ? (
                <p className={styles.subtitleHeading}>{item.name}</p>
              ) : (
                <span />
              )}
              {item.organization_name ? (
                <div className={styles.subtitle}>{item.organization_name}</div>
              ) : (
                <span />
              )}
              {item.issued_date ? (
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

  //At component mount which section of resume contains which tab details.
  useEffect(() => {
    if (showExperince && showCertification) {
      setColumns([
        [
          sections.skills,
          sections.education,
          sections.certification,
          sections.achievements
        ],
        [sections.workExp, sections.project]
      ]);
    } else if (showCertification) {
      setColumns([
        [
          sections.skills,
          sections.education,
          sections.certification,
          sections.achievements
        ],
        [sections.project]
      ]);
    } else if (showExperince) {
      setColumns([
        [sections.skills, sections.education, sections.achievements],
        [sections.workExp, sections.project]
      ]);
    } else {
      setColumns([[sections.skills, sections.education], [sections.project]]);
    }
  }, []);

  //Whenever active colour changes from Body component then this effect
  // will be called.
  useEffect(() => {
    //to get that container div in which --color property to be changed.
    const container = containerRef.current;
    if (!activeColor || !container) {
      return;
    }

    container.style.setProperty("--color", activeColor);
  }, [activeColor]);

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
            <p className={styles.heading}>{info.profile?.detail?.name}</p>
            <div className={styles.subHeading}>
              {info.profile?.detail?.designation}
              {info.profile?.detail?.gender && (
                <span className="px-2">({info.profile?.detail?.gender})</span>
              )}
            </div>
            <div className={styles.experienceHeading}>
              <div>
                <CaretRightOutlined />{" "}
                {info.profile?.detail?.years_of_experience}
                <span> Year of Experience</span>
              </div>
              <div>
                <MailOutlined /> {info.profile?.detail?.email}
              </div>
              {info.profile?.detail?.mobile && (
                <div>
                  <MobileOutlined /> {info.profile?.detail?.mobile}
                </div>
              )}

              <div className={styles.socialLink}>
                <GithubOutlined />{" "}
                <Link target="_blank" to={info.profile?.detail?.github_link}>
                  GitHub
                </Link>{" "}
                <LinkedinOutlined />{" "}
                <Link target="_blank" to={info.profile?.detail?.linkedin_link}>
                  LinkedIn
                </Link>
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
                  {info.profile?.detail?.description}
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

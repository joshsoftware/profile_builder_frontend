import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  AtSign,
  Calendar,
  GitHub,
  Linkedin,
  MapPin,
  Paperclip,
  Phone,
} from "react-feather";

import styles from "./Resume.module.css";
import { INTERNAL } from "../Body/Body";
import joshImage from "../../assets/Josh-Logo-White-bg.svg";
import { getMonthString } from "../../utils/helpers";

//we cannt pass ref directly to component so we should wrap a component in forwardRef.
const Resume = forwardRef((props, ref) => {
  const {
    showExperince,
    showCertification,
    information,
    sections,
    profile,
    activeColor,
  } = props;
  // const information = props.information;
  // const sections = props.sections;
  // const profile = props.profile;
  const containerRef = useRef();

  console.log("Information", information);

  //which divides an resume into two sections and at mounting tqo section contains which fields are populated.
  const [columns, setColumns] = useState([[], []]);

  const info = {
    basicInfo: information[sections.basicInfo],
    workExp: information[sections.workExp],
    project: information[sections.project],
    education: information[sections.education],
    skills: information[sections.skills],
    certification: information[sections.certification],
  };

  const getFormattedDate = (value) => {
    if (!value) return "";
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
    } else return `${givenDate}/${givenMonth}/${givenYear}`;
  };

  const getPassingYear = (value) => {
    console.log("In Passout Year Function...", value);
    if (!value) return "";
    const date = new Date(value);

    const givenYear = date.getFullYear();

    return givenYear;
  };

  const getMonthYear = (value) => {
    console.log("In Month Year Format");
    if (!value) return;
    const date = new Date(value);

    const givenYear = date.getFullYear();
    const givenMonth = date.getMonth();

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
        <div className={styles.sectionTitle}>{info.workExp?.sectionTitle}</div>
        <div className={styles.content}>
          {info?.workExp?.details?.map((item) => (
            <div className={styles.item} key={item.title}>
              {item?.role || item?.companyName ? (
                <p className={styles.title}>{item.role}</p>
              ) : (
                <span />
              )}

              {item?.companyName ? (
                <div className={styles.date}>
                  <span className={styles.subtitle}>{item.companyName}</span>
                  | <Calendar /> {getFormattedDate(item?.startDate)} -{" "}
                  {getFormattedDate(item?.endDate)}
                </div>
              ) : (
                <span />
              )}

              {item?.points?.length > 0 ? (
                <ul className={styles.points}>
                  {item.points?.map((elem, index) => (
                    <li className={styles.point} key={elem + index}>
                      {elem}
                    </li>
                  ))}
                </ul>
              ) : (
                <span />
              )}
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
        <div className={styles.sectionTitle}>{info?.project?.sectionTitle}</div>
        <div className={styles.content}>
          {info?.project?.details?.map((item) => (
            <div className={styles.item}>
              {item?.projectName ? (
                <h2 className={styles.title}>
                  <b className={styles.underline}>{item.projectName}</b>
                  {item?.projectStartDate && item?.projectEndDate ? (
                    <span className={`${styles.monthDuration} px-2`}>
                      | {getMonthYear(item.projectStartDate)} To
                      {getMonthYear(item.projectEndDate)}
                    </span>
                  ) : (
                    <span />
                  )}
                </h2>
              ) : (
                <span />
              )}

              {item?.projectDuration ? (
                <span className={styles.duration}>
                  <b className={styles.title}>Duration : </b>
                  {item.projectDuration}
                </span>
              ) : (
                <span />
              )}

              {item?.overview ? (
                <div>
                  <h6>
                    <b>Project Description</b>
                  </h6>
                  <p className={styles.overview}>{item.overview} </p>
                </div>
              ) : (
                <span />
              )}

              {item?.points?.length > 0 ? (
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
              )}
              {item?.technology ? (
                <p className={styles.overview}>
                  <b>Project Techstack : </b>
                  {item.technology}
                </p>
              ) : (
                <span />
              )}
              {item?.workedProjectTech ? (
                <p className={styles.overview}>
                  <b>My Contribution : </b>
                  {item.workedProjectTech}
                </p>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    [sections.education]: (
      <div
        key={"education"}
        className={`${styles.section} ${
          info.education?.sectionTitle ? "" : styles.hidden
        } pt-3`}
      >
        <div className={styles.separate}></div>
        <div className={`${styles.leftSection} pt-2`}>
          {info.education?.sectionTitle}
        </div>
        <div className={styles.content}>
          {info?.education?.details?.map((item) => (
            <div className={styles.educationItem}>
              {item.educationTitle ? (
                <p className={styles.subtitleHeading}>{item.educationTitle}</p>
              ) : (
                <span />
              )}
              {item.college ? (
                <p className={styles.subtitle}>{item.college}</p>
              ) : (
                <span />
              )}
              {item.passOutDate ? (
                <div className={styles.passingDate}>
                  Passing Year : {getPassingYear(item.passOutDate)}
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
            <ul className={styles.numbered}>
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
          {info?.certification?.points?.length > 0 ? (
            <ul className={styles.numbered}>
              {info.certification?.points?.map((elem, index) => (
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
  };

  //At component mount which section of resume contains which tab details.
  useEffect(() => {
    if (showExperince && showCertification) {
      setColumns([
        [sections.skills, sections.education, sections.certification],
        [sections.workExp, sections.project],
      ]);
    } else if (showCertification) {
      setColumns([
        [sections.skills, sections.education, sections.certification],
        [sections.project],
      ]);
    } else if (showExperince) {
      setColumns([
        [sections.skills, sections.education],
        [sections.workExp, sections.project],
      ]);
    } else {
      setColumns([[sections.skills, sections.education], [sections.project]]);
    }
  }, [profile, information]);

  //Whenever active colour changes from Body component then this effect
  // will be called.
  useEffect(() => {
    //to get that container div in which --color property to be changed.
    const container = containerRef.current;
    if (!activeColor || !container) return;

    container.style.setProperty("--color", activeColor);
  }, [activeColor]);

  const getPageMargins = () => {
    return `@page { margin: ${"1rem"} ${"0"} ${"1rem"} ${"0"} !important }`;
  };

  return (
    // Passing to be print content ref to reacttopdf component.
    <div ref={ref}>
      <style>{getPageMargins()}</style>
      {/* No we have to change color of text so we are taking container ref.
      to do so we have to modify --color property in styles. */}
      <div ref={containerRef} className={styles.container}>
        <div className={styles.header}>
          <p className={styles.heading}>{info.basicInfo?.detail?.name}</p>
          <p className={styles.subHeading}>
            {info.basicInfo?.detail?.title}
            {info.basicInfo?.detail?.gender && (
              <span className="px-2">({info.basicInfo?.detail?.gender})</span>
            )}
          </p>
          <p className={styles.experienceHeading}>
            {info.basicInfo?.detail?.experienceInYear}
          </p>
          <img
            src={joshImage}
            alt="Not Found"
            width={250}
            height={180}
            className={styles.logo}
          />
        </div>

        <div className="container">
          <div class="row pr-2">
            <div className={`col-4 pb-5 ${styles.middleSeparatorLine}`}>
              {columns[0].map((item) => sectionDiv[item])}
            </div>
            <div className="col-8 mr-5">
              <div>
                <h4>
                  <b className={`${styles.paddingLeft} ${styles.sectionTitle}`}>
                    Profile
                  </b>
                </h4>
              </div>
              <div className={`${styles.profiledetails} pb-3`}>
                {info.basicInfo?.detail?.profile}
              </div>
              {columns[1].map((item) => sectionDiv[item])}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Resume;

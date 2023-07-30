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

//we cannt pass ref directly to component so we should wrap a component in forwardRef.
const Resume = forwardRef((props, ref) => {
  const { showExperince, information, sections, profile } = props;
  // const information = props.information;
  // const sections = props.sections;
  // const profile = props.profile;
  const containerRef = useRef();

  // console.log("Sections", sections);
  console.log("Information", information);

  //which divides an resume into two sections and at mounting tqo section contains which fields are populated.
  const [columns, setColumns] = useState([[], []]);
  //Drag and drop based on source and destination Id.
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");

  const info = {
    basicInfo: information[sections.basicInfo],
    workExp: information[sections.workExp],
    project: information[sections.project],
    education: information[sections.education],
    skills: information[sections.skills],
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
    if (!value) return "";
    const date = new Date(value);

    const givenYear = date.getFullYear();

    return givenYear;
  };

  //Different section of tabs for Drag and Drop functionality.
  const sectionDiv = {
    [sections.workExp]: (
      <div
        key={"workexp"}
        draggable
        //This event handler will execute when drag in targeted on enclosed div.
        onDragOver={() => setTarget(info.workExp?.id)}
        //This event handler will execute when dropped on enclosed div.
        onDragEnd={() => setSource(info.workExp?.id)}
        className={`${styles.section} pb-4 ${
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
        draggable
        onDragOver={() => setTarget(info.project?.id)}
        onDragEnd={() => setSource(info.project?.id)}
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
                </h2>
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
                  <b>Technology Used : </b>
                  {item.technology}
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
        draggable
        onDragOver={() => setTarget(info.education?.id)}
        onDragEnd={() => setSource(info.education?.id)}
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
              {item.startDate && item.endDate ? (
                <div className={styles.passingDate}>
                  Passing Year : {getPassingYear(item.endDate)}
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
        draggable
        onDragOver={() => setTarget(info.skills?.id)}
        onDragEnd={() => setSource(info.skills?.id)}
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
  };

  const swapSourceTarget = (source, target) => {
    if (!source || !target) return;
    const tempColumns = [[...columns[0]], [...columns[1]]];

    //finding Source Index.
    let sourceRowIndex = tempColumns[0].findIndex((item) => item === source);
    let sourceColumnIndex = 0;
    //if source index not in column 0.
    if (sourceRowIndex < 0) {
      sourceColumnIndex = 1;
      sourceRowIndex = tempColumns[1].findIndex((item) => item === source);
    }

    let targetRowIndex = tempColumns[0].findIndex((item) => item === target);
    let targetColumnIndex = 0;
    if (targetRowIndex < 0) {
      targetColumnIndex = 1;
      targetRowIndex = tempColumns[1].findIndex((item) => item === target);
    }

    //finding source and thens tore it in temp variable.
    const tempSource = tempColumns[sourceColumnIndex][sourceRowIndex];
    //replacing source index with target index.
    tempColumns[sourceColumnIndex][sourceRowIndex] =
      tempColumns[targetColumnIndex][targetRowIndex];
    //replacing target index with source index stored in temp variable.
    tempColumns[targetColumnIndex][targetRowIndex] = tempSource;
    setColumns(tempColumns);
  };

  //At component mount which section of resume contains which tab details.
  useEffect(() => {
    if (!showExperince) {
      setColumns([[sections.skills, sections.education], [sections.project]]);
    } else {
      setColumns([
        [sections.skills, sections.education],
        [sections.workExp, sections.project],
      ]);
    }
  }, [profile, information]);

  useEffect(() => {
    //This sideeffect will be called when source.i.e. Drag is happening.
    swapSourceTarget(source, target);
  }, [source]);

  //Whenever active colour changes from Body component then this effect
  // will be called.
  useEffect(() => {
    //to get that container div in which --color property to be changed.
    const container = containerRef.current;
    if (!props.activeColor || !container) return;

    container.style.setProperty("--color", props.activeColor);
  }, [props.activeColor]);

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
          <p className={styles.subHeading}>{info.basicInfo?.detail?.title}</p>
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

import React, { isValidElement, useEffect, useState } from "react";

import styles from "./Editor.module.css";
import InputControl from "../InputControl/InputControl";

import { PlusCircle, X } from "react-feather";
import TextAreaControl from "../InputControl/TextAreaControl";

const Editor = ({
  sections,
  information,
  setInformation,
  profile,
  showExperince,
  ShowExperience,
}) => {
  //State to choose tabs between different by default shows first tab.
  const [activeSectionKey, setActiveSectionKey] = useState(
    Object.keys(sections)[0]
  );

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    title: "",
    profile: "",
    points: "",
    educationTitle: "",
    college: "",
  });

  //To hold current tab informations.
  const [activeInformation, setActiveInformation] = useState(
    information[sections[Object.keys(sections)[0]]]
  );

  //navigate between chips of Form fields.
  const [activeDetailIndex, setActiveDetailIndex] = useState(0);

  //It is for each sections Title Field.
  const [sectionTitle, setSectionTitle] = useState(
    sections[Object.keys(sections)[0]]
  );

  //As By Default first tab is selected which is of Basic Info,so all values
  //in basic info tab will be set.
  const [values, setValues] = useState({
    name: activeInformation?.detail?.name || "",
    title: activeInformation?.detail?.title || "",
    profile: activeInformation?.detail?.profile || "",
    points: activeInformation?.details?.points || [],
    educationTitle: activeInformation?.details?.educationTitle || "",
  });

  useEffect(() => {
    const activeInfo = information[sections[activeSectionKey]];
    //whenever section tabs changes then ActiveInformation state contains selected
    //tab information only.
    setActiveInformation(activeInfo);
    //set section title field when section tabs changes.
    setSectionTitle(sections[activeSectionKey]);

    //To reset chip.
    setActiveDetailIndex(0);
    setValues({
      name: activeInfo?.detail?.name || "",
      title: activeInfo?.detail?.title || "",
      profile: activeInfo?.detail?.profile || "",

      role: activeInfo?.details ? activeInfo.details[0]?.role || "" : "",
      companyName: activeInfo?.details
        ? activeInfo.details[0]?.companyName || ""
        : "",

      projectName: activeInfo?.details
        ? activeInfo.details[0]?.projectName || ""
        : "",
      overview: activeInfo?.details
        ? activeInfo.details[0]?.overview || ""
        : "",
      technology: activeInfo?.details
        ? activeInfo.details[0]?.technology || ""
        : "",

      educationTitle: activeInfo?.details
        ? activeInfo.details[0]?.title || ""
        : activeInfo?.detail?.title || "",
      college: activeInfo?.details ? activeInfo.details[0]?.college || "" : "",

      startDate: activeInfo?.details
        ? activeInfo.details[0]?.startDate || ""
        : "",
      endDate: activeInfo?.details ? activeInfo.details[0]?.endDate || "" : "",
      points: activeInfo?.details
        ? activeInfo.details[0]?.points
          ? [...activeInfo.details[0]?.points]
          : []
        : activeInfo?.points
        ? [...activeInfo.points]
        : [],
    });
  }, [activeSectionKey]);

  //This will update chips when we create and save like experience.
  useEffect(() => {
    setActiveInformation(information[sections[activeSectionKey]]);
  }, [information]);

  useEffect(() => {
    const details = activeInformation?.details;
    if (!details) return;

    const activeInfo = information[sections[activeSectionKey]];
    //we are resetting to initial values whenever new chips gets selected.
    setValues({
      name: activeInfo.details[activeDetailIndex]?.name || "",
      title: activeInfo.details[activeDetailIndex]?.title || "",
      profile: activeInfo.details[activeDetailIndex]?.profile || "",
      role: activeInfo.details[activeDetailIndex]?.role || "",
      overview: activeInfo.details[activeDetailIndex]?.overview || "",
      companyName: activeInfo.details[activeDetailIndex]?.companyName || "",
      projectName: activeInfo.details[activeDetailIndex]?.projectName || "",
      technology: activeInfo.details[activeDetailIndex]?.technology || "",
      startDate: activeInfo.details[activeDetailIndex]?.startDate || "",
      endDate: activeInfo.details[activeDetailIndex]?.endDate || "",
      points: activeInfo.details[activeDetailIndex]?.points || [],
      educationTitle: activeInfo.details[activeDetailIndex]?.title || "",
      college: activeInfo.details[activeDetailIndex]?.college || "",
    });
  }, [activeDetailIndex]);

  const handleChange = (event, index) => {
    const inputData = [...values.points];
    inputData[index] = event.target.value;
    setValues((prev) => ({ ...prev, points: inputData }));
  };

  const handleAdd = () => {
    const abc = [...values.points, []];
    setValues((prev) => ({ ...prev, points: abc }));
  };

  const handleDelete = (index) => {
    const deletePoints = [...values.points];
    deletePoints.splice(index, 1);
    setValues((prev) => ({ ...prev, points: deletePoints }));
  };

  const isFieldInValid = (value) => {
    if (value.trim() === "") {
      return true;
    } else return false;
  };

  const checkField = (value, key) => {
    if (value.trim() === "") {
      setErrorMessage((prev) => ({
        ...prev,
        key: "Please Enter Name",
      }));
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        key: "",
      }));
    }
  };

  const basicInfoBody = (
    <div className={styles.detail}>
      <div className={styles.row}>
        <InputControl
          label="Full Name"
          placeholder="Enter your full name"
          value={values.name}
          onChange={(event) => {
            if (event.target.value.trim() === "") {
              setErrorMessage((prev) => ({
                ...prev,
                name: "Please Enter Name",
              }));
              setValues((prev) => ({ ...prev, name: event.target.value }));
            } else {
              setValues((prev) => ({ ...prev, name: event.target.value }));
              setErrorMessage((prev) => ({
                ...prev,
                name: "",
              }));
            }
          }}
          errorMessage={errorMessage.name}
        />
        <InputControl
          label="Designation"
          value={values.title}
          placeholder="Ex.Frontend Engineer,PowerBI Engineer"
          onChange={(event) => {
            if (event.target.value.trim() === "") {
              setErrorMessage((prev) => ({
                ...prev,
                title: "Please Enter Designation",
              }));
              setValues((prev) => ({ ...prev, title: event.target.value }));
            } else {
              setValues((prev) => ({ ...prev, title: event.target.value }));
              setErrorMessage((prev) => ({
                ...prev,
                title: "",
              }));
            }
          }}
          errorMessage={errorMessage.title}
        />
      </div>
      <div>
        <TextAreaControl
          label="Profile Details"
          value={values.profile}
          placeholder="Enter Profile Details"
          rows="4"
          onChange={(event) => {
            if (event.target.value.trim() === "") {
              setErrorMessage((prev) => ({
                ...prev,
                profile: "Please Enter Profile Details",
              }));
              setValues((prev) => ({ ...prev, profile: event.target.value }));
            } else {
              setValues((prev) => ({ ...prev, profile: event.target.value }));
              setErrorMessage((prev) => ({
                ...prev,
                profile: "",
              }));
            }
          }}
          errorMessage={errorMessage.profile}
        />
      </div>
    </div>
  );

  const workExpBody = (
    <div className={styles.detail}>
      <div className={styles.row}>
        <InputControl
          label="Designation"
          placeholder="Enter Role eg. Frontend developer"
          value={values.role}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, role: event.target.value }))
          }
          errorMessage={errorMessage.role}
          required
        />
        <InputControl
          label="Organization Name"
          placeholder="Enter company name ex. Amazon"
          value={values.companyName}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, companyName: event.target.value }))
          }
          errorMessage={errorMessage.companyName}
          required
        />
      </div>

      <div className={styles.row}>
        <InputControl
          label="Employment Start Date"
          type="date"
          placeholder="Enter start date of work"
          value={values.startDate}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, startDate: event.target.value }))
          }
          errorMessage={errorMessage.startDate}
          required
        />
        <InputControl
          label="Employment End Date"
          type="date"
          placeholder="Enter end date of work"
          value={values.endDate}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, endDate: event.target.value }))
          }
          errorMessage={errorMessage.endDate}
          required
        />
      </div>
    </div>
  );

  const projectBody = (
    <div className={styles.detail}>
      <div className={styles.row}>
        <InputControl
          label="Project Name"
          value={values.projectName}
          placeholder="Enter Project Name"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, projectName: event.target.value }))
          }
          errorMessage={errorMessage.projectName}
        />
      </div>
      <TextAreaControl
        label="Project Overview"
        value={values.overview}
        placeholder="Enter basic overview of project"
        rows="3"
        onChange={(event) =>
          setValues((prev) => ({ ...prev, overview: event.target.value }))
        }
        errorMessage={errorMessage.overview}
      />
      <div className={styles.column}>
        <label>Enter Roles And Responsibility</label>
        <button onClick={() => handleAdd()}>
          <PlusCircle />
        </button>

        {values?.points?.map((data, index) => (
          <div className={styles.pointsContainer}>
            <InputControl
              placeholder={`Line ${index + 1}`}
              value={data}
              onChange={(event) => handleChange(event, index)}
              className={styles.input}
            />
            <button
              onClick={() => handleDelete(index)}
              className={styles.crossbtn}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <InputControl
        label="Project Technology"
        value={values.technology}
        placeholder="Technology Used"
        onChange={(event) =>
          setValues((prev) => ({ ...prev, technology: event.target.value }))
        }
        errorMessage={errorMessage.technology}
      />
    </div>
  );

  const educationBody = (
    <div className={styles.detail}>
      <div className={styles.row}>
        <InputControl
          label="Masters/Degree/Diploma"
          value={values.educationTitle}
          placeholder="Enter title ex. B-tech"
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              educationTitle: event.target.value,
            }))
          }
          errorMessage={errorMessage.educationTitle}
          required
        />
      </div>
      <InputControl
        label="University Name"
        value={values.college}
        placeholder="Enter name of your college/school"
        onChange={(event) =>
          setValues((prev) => ({ ...prev, college: event.target.value }))
        }
        errorMessage={errorMessage.college}
        required
      />
      <div className="col-6">
        <InputControl
          label="Pass Out Date"
          type="date"
          placeholder="Enter end date of this education"
          value={values.endDate}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, endDate: event.target.value }))
          }
          errorMessage={errorMessage.endDate}
          required
        />
      </div>
    </div>
  );

  const skillsBody = (
    <div className={styles.detail}>
      <div className={styles.column}>
        <label>Add Skills</label>
        <button onClick={() => handleAdd()}>
          <PlusCircle />
        </button>

        {values?.points?.map((data, index) => (
          <div className={styles.pointsContainer}>
            <InputControl
              placeholder={`Line ${index + 1}`}
              value={data}
              onChange={(event) => handleChange(event, index)}
              className={styles.input}
            />
            <button
              onClick={() => handleDelete(index)}
              className={styles.crossbtn}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  //we are updating information passed from Body component.
  const handleSubmission = () => {
    console.log(values);
    switch (sections[activeSectionKey]) {
      case sections.basicInfo: {
        if (isFieldInValid(values.name)) {
          setErrorMessage((prev) => ({
            ...prev,
            name: "Please Enter Name",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            name: "",
          }));
        }
        if (isFieldInValid(values.title)) {
          setErrorMessage((prev) => ({
            ...prev,
            title: "Designation Can't be blank",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            title: "",
          }));
        }
        if (isFieldInValid(values.profile)) {
          setErrorMessage((prev) => ({
            ...prev,
            profile: "Profile Can't be blank",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            profile: "",
          }));
        }

        if (values.name === "" || values.title === "" || values.profile === "")
          return;

        const tempDetail = {
          name: values.name,
          title: values.title,
          profile: values.profile,
        };

        setInformation((prev) => ({
          ...prev,
          [sections.basicInfo]: {
            ...prev[sections.basicInfo],
            detail: tempDetail,
            sectionTitle,
          },
        }));
        break;
      }
      case sections.workExp: {
        if (isFieldInValid(values.startDate)) {
          setErrorMessage((prev) => ({
            ...prev,
            startDate: "Please Enter Start Date",
          }));
        }
        if (isFieldInValid(values.endDate)) {
          setErrorMessage((prev) => ({
            ...prev,
            endDate: "Please Enter End Date",
          }));
        }
        if (isFieldInValid(values.companyName)) {
          setErrorMessage((prev) => ({
            ...prev,
            companyName: "Please Enter Company Name",
          }));
        }
        if (isFieldInValid(values.role)) {
          setErrorMessage((prev) => ({
            ...prev,
            role: "Please Mention Designation",
          }));
        }
        const tempDetail = {
          startDate: values?.startDate,
          endDate: values?.endDate,
          companyName: values?.companyName,
          role: values?.role,
        };

        console.log("TempDetails", information?.sections?.workExp?.details);

        //finding out details then updating particular details index values.
        const tempDetails = [...information[sections.workExp].details];
        tempDetails[activeDetailIndex] = tempDetail;

        setInformation((prev) => ({
          ...prev,
          [sections.workExp]: {
            ...prev[sections.workExp],
            details: tempDetails,
            sectionTitle,
          },
        }));
        break;
      }
      case sections.project: {
        if (isFieldInValid(values.projectName)) {
          setErrorMessage((prev) => ({
            ...prev,
            projectName: "Please Enter Project Name",
          }));
        }
        if (isFieldInValid(values.overview)) {
          setErrorMessage((prev) => ({
            ...prev,
            overview: "Please Enter Project Overview",
          }));
        }
        if (isFieldInValid(values.technology)) {
          setErrorMessage((prev) => ({
            ...prev,
            technology: "Please Enter Project Technology",
          }));
        }

        const filteredPoints = values.points.filter(
          (item) => item.length !== 0
        );

        const tempDetail = {
          projectName: values.projectName,
          overview: values.overview,
          points: filteredPoints,
          technology: values.technology,
        };

        console.log("Projects", information[sections.project]?.details);
        const tempDetails = [...information[sections.project]?.details];
        tempDetails[activeDetailIndex] = tempDetail;

        setInformation((prev) => ({
          ...prev,
          [sections.project]: {
            ...prev[sections.project],
            details: tempDetails,
            sectionTitle,
          },
        }));
        break;
      }
      case sections.education: {
        if (isValidElement(values.educationTitle)) {
          setErrorMessage((prev) => ({
            ...prev,
            educationTitle: "Please Enter Education Details",
          }));
        }
        const tempDetail = {
          educationTitle: values?.educationTitle,
          college: values?.college,
          startDate: values?.startDate,
          endDate: values?.endDate,
        };
        const tempDetails = [...information[sections.education]?.details];
        tempDetails[activeDetailIndex] = tempDetail;

        setInformation((prev) => ({
          ...prev,
          [sections.education]: {
            ...prev[sections.education],
            details: tempDetails,
            sectionTitle,
          },
        }));
        break;
      }
      case sections.skills: {
        const filteredPoints = values.points.filter(
          (item) => item.length !== 0
        );

        setInformation((prev) => ({
          ...prev,
          [sections.skills]: {
            ...prev[sections.skills],
            points: filteredPoints,
            sectionTitle,
          },
        }));
        break;
      }
    }
  };

  //as per current active sections which forms to show.
  const generateBody = () => {
    switch (sections[activeSectionKey]) {
      case sections.basicInfo:
        return basicInfoBody;
      case sections.workExp:
        return workExpBody;
      case sections.project:
        return projectBody;
      case sections.education:
        return educationBody;
      case sections.skills:
        return skillsBody;
      default:
        return null;
    }
  };

  const handleAddNew = () => {
    const details = activeInformation.details;
    if (!details) return;
    const lastDetail = details?.slice(-1)[0];
    //if last experience is not added then he would not be able to create new.
    if (!Object.keys(lastDetail).length) return;
    details?.push({});
    setInformation((prev) => ({
      ...prev,
      [sections[activeSectionKey]]: {
        ...information[sections[activeSectionKey]],
        details: details,
      },
    }));
    setActiveDetailIndex(details?.length - 1);
  };

  const handleDeleteDetail = (index) => {
    const details = activeInformation?.details
      ? [...activeInformation.details]
      : "";
    if (!details) return;
    details.splice(index, 1);
    setInformation((prev) => ({
      ...prev,
      [sections[activeSectionKey]]: {
        ...information[sections[activeSectionKey]],
        details: details,
      },
    }));

    setActiveDetailIndex((prev) => (prev === index ? 0 : prev));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {Object.keys(sections)?.map((key) => (
          <div
            className={`${styles.section} ${
              activeSectionKey === key ? styles.active : null
            }`}
            key={key}
            //Update activesectionkey and applies styles.active class to active
            //section key.
            onClick={() => {
              setActiveSectionKey(key);
            }}
          >
            {sections[key]}
          </div>
        ))}
      </div>
      <div className={styles.body}>
        <div className={styles.chips}>
          {/* If details is non empty array(details) then map it to chips. */}
          {activeInformation?.details
            ? activeInformation?.details?.map((item, index) => (
                <div
                  className={`${styles.chip} ${
                    activeDetailIndex == index ? styles.active : ""
                  }`}
                  key={item.title + index}
                  onClick={() => setActiveDetailIndex(index)}
                >
                  <div>
                    {sections[activeSectionKey]} {index + 1}
                  </div>
                  <X
                    onClick={(event) => {
                      //to prevent event bubbling as div contains two functions
                      //so parent onclick handler also gets called.
                      event.stopPropagation();
                      handleDeleteDetail(index);
                    }}
                  />
                </div>
              ))
            : ""}
          {activeInformation?.details &&
            activeInformation?.details?.length > 0 && (
              <div className={styles.new} onClick={handleAddNew}>
                +New
              </div>
            )}
        </div>

        {generateBody()}
        <button className={styles.button} onClick={handleSubmission}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Editor;

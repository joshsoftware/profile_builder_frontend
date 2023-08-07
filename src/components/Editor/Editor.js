import React, { isValidElement, useEffect, useState } from "react";

import styles from "./Editor.module.css";
import style from "../InputControl/InputControl.module.css";
import InputControl from "../InputControl/InputControl";

import { PlusCircle, X } from "react-feather";
import TextAreaControl from "../InputControl/TextAreaControl";
import { isFieldInValid } from "../../helpers";
import SelectControl from "../InputControl/SelectControl";
import { genderOptions } from "../../utils/helpers";

const Editor = ({ sections, information, setInformation, profile }) => {
  //State to choose tabs between different by default shows first tab.
  const [activeSectionKey, setActiveSectionKey] = useState(
    Object.keys(sections)[0]
  );

  //To handle error message state.
  const [errorMessage, setErrorMessage] = useState({
    name: "",
    title: "",
    profile: "",
    points: "",
    educationTitle: "",
    college: "",
    experienceInYear: "",
    workedProjectTech: "",
    gender: "",
    projectStartDate: "",
    projectEndDate: "",
    projectDuration: "",
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
    gender: activeInformation?.detail?.gender || "",
    experienceInYear: activeInformation?.detail?.experienceInYear || "",
    profile: activeInformation?.detail?.profile || "",
    points: activeInformation?.details?.points || [],
    educationTitle: activeInformation?.details?.educationTitle || "",
    workedProjectTech: activeInformation?.details?.workedProjectTech || "",
    projectStartDate: activeInformation?.details?.projectStartDate || "",
    projectEndDate: activeInformation?.details?.projectEndDate || "",
    projectDuration: activeInformation?.details?.projectDuration || "",
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
      experienceInYear: activeInfo?.detail?.experienceInYear || "",
      gender: activeInfo?.detail?.gender || "",

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
      workedProjectTech: activeInfo?.details
        ? activeInfo.details[0]?.workedProjectTech || ""
        : "",

      projectStartDate: activeInfo?.details
        ? activeInfo.details[0]?.projectStartDate || ""
        : "",
      projectEndDate: activeInfo?.details
        ? activeInfo.details[0]?.projectEndDate || ""
        : "",
      projectDuration: activeInfo?.details
        ? activeInfo.details[0]?.projectDuration || ""
        : "",

      educationTitle: activeInfo?.details
        ? activeInfo.details[0]?.title || ""
        : activeInfo?.detail?.title || "",
      college: activeInfo?.details ? activeInfo.details[0]?.college || "" : "",

      startDate: activeInfo?.details
        ? activeInfo.details[0]?.startDate || ""
        : "",
      endDate: activeInfo?.details ? activeInfo.details[0]?.endDate || "" : "",
      passOutDate: activeInfo?.details
        ? activeInfo.details[0]?.passOutDate || ""
        : "",
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
      experienceInYear:
        activeInfo.details[activeDetailIndex]?.experienceInYear || "",
      gender: activeInfo.details[activeDetailIndex]?.gender || "",
      profile: activeInfo.details[activeDetailIndex]?.profile || "",
      role: activeInfo.details[activeDetailIndex]?.role || "",
      overview: activeInfo.details[activeDetailIndex]?.overview || "",
      companyName: activeInfo.details[activeDetailIndex]?.companyName || "",
      projectName: activeInfo.details[activeDetailIndex]?.projectName || "",
      workedProjectTech:
        activeInfo.details[activeDetailIndex]?.workedProjectTech || "",

      projectStartDate:
        activeInfo.details[activeDetailIndex]?.projectStartDate || "",
      projectEndDate:
        activeInfo.details[activeDetailIndex]?.projectEndDate || "",
      projectDuration:
        activeInfo.details[activeDetailIndex]?.projectDuration || "",

      technology: activeInfo.details[activeDetailIndex]?.technology || "",
      startDate: activeInfo.details[activeDetailIndex]?.startDate || "",
      endDate: activeInfo.details[activeDetailIndex]?.endDate || "",
      passOutDate: activeInfo.details[activeDetailIndex]?.passOutDate || "",
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

  const basicInfoBody = (
    <div className={styles.detail}>
      <div className={styles.row}>
        <InputControl
          label="Full Name"
          isCompulsory={true}
          placeholder="Enter Your Full Name"
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
              // handleSubmission();
            }
          }}
          errorMessage={errorMessage.name}
        />
        <InputControl
          label="Designation"
          isCompulsory={true}
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
              // handleSubmission();
            }
          }}
          errorMessage={errorMessage.title}
        />
      </div>
      <div className={styles.row}>
        <InputControl
          label="Year Of Experience"
          isCompulsory={true}
          placeholder="Ex. 3.7+ Year Of Experience In Manual Testing"
          value={values.experienceInYear}
          onChange={(event) => {
            if (event.target.value.trim() === "") {
              setErrorMessage((prev) => ({
                ...prev,
                experienceInYear: "Please Enter Year Of Experience",
              }));
              setValues((prev) => ({
                ...prev,
                experienceInYear: event.target.value,
              }));
            } else {
              setValues((prev) => ({
                ...prev,
                experienceInYear: event.target.value,
              }));
              setErrorMessage((prev) => ({
                ...prev,
                experienceInYear: "",
              }));
            }
          }}
          errorMessage={errorMessage.experienceInYear}
        />
        <div className="col-6">
          <SelectControl
            label="Choose Gender"
            selectOptions={genderOptions}
            onChange={(event) => {
              setValues((prev) => ({
                ...prev,
                gender: event.target.value,
              }));
            }}
          />
        </div>
      </div>
      <div className={styles.row}>
        <TextAreaControl
          label="Profile Details"
          isCompulsory={true}
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
          isCompulsory={true}
          placeholder="Enter Role Ex. Frontend Developer"
          value={values.role}
          onChange={(event) => {
            if (event.target.value.trim() === "") {
              setErrorMessage((prev) => ({
                ...prev,
                role: "Please Enter Project Name",
              }));
              setValues((prev) => ({
                ...prev,
                role: event.target.value,
              }));
            } else {
              setValues((prev) => ({
                ...prev,
                role: event.target.value,
              }));
              setErrorMessage((prev) => ({
                ...prev,
                role: "",
              }));
            }
          }}
          errorMessage={errorMessage.role}
        />
        <InputControl
          label="Organization Name"
          isCompulsory={true}
          placeholder="Enter Company Name Ex. Amazon"
          value={values.companyName}
          onChange={(event) => {
            if (event.target.value.trim() === "") {
              setErrorMessage((prev) => ({
                ...prev,
                companyName: "Please Enter Company Name",
              }));
              setValues((prev) => ({
                ...prev,
                companyName: event.target.value,
              }));
            } else {
              setValues((prev) => ({
                ...prev,
                companyName: event.target.value,
              }));
              setErrorMessage((prev) => ({
                ...prev,
                companyName: "",
              }));
            }
          }}
          errorMessage={errorMessage.companyName}
          required
        />
      </div>
      <InputControl
        label="Employment Start Date"
        isCompulsory={true}
        type="date"
        placeholder="Enter Start Date of Employment"
        value={values.startDate}
        onChange={(event) => {
          if (event.target.value.trim() === "") {
            setErrorMessage((prev) => ({
              ...prev,
              startDate: "Please Enter Start Date",
            }));
            setValues((prev) => ({
              ...prev,
              startDate: event.target.value,
            }));
          } else {
            setValues((prev) => ({
              ...prev,
              startDate: event.target.value,
            }));
            setErrorMessage((prev) => ({
              ...prev,
              startDate: "",
            }));
          }
        }}
        errorMessage={errorMessage.startDate}
      />
      <InputControl
        label="Employment End Date"
        isCompulsory={true}
        type="date"
        placeholder="Enter End Date of Employment"
        value={values.endDate}
        onChange={(event) => {
          if (event.target.value.trim() === "") {
            setErrorMessage((prev) => ({
              ...prev,
              endDate: "Please Enter End Date",
            }));
            setValues((prev) => ({
              ...prev,
              endDate: event.target.value,
            }));
          } else {
            setValues((prev) => ({
              ...prev,
              endDate: event.target.value,
            }));
            setErrorMessage((prev) => ({
              ...prev,
              endDate: "",
            }));
          }
        }}
        errorMessage={errorMessage.endDate}
        required
      />
    </div>
  );

  const projectBody = (
    <div className={styles.detail}>
      <div className={styles.warning}>
        Note : Project Duration Should match with Project Start and End Date.
      </div>
      <div className={styles.row}>
        <InputControl
          label="Project Name"
          isCompulsory={true}
          value={values.projectName}
          placeholder="Enter Project Name"
          onChange={(event) => {
            if (event.target.value.trim() === "") {
              setErrorMessage((prev) => ({
                ...prev,
                projectName: "Please Enter Project Name",
              }));
              setValues((prev) => ({
                ...prev,
                projectName: event.target.value,
              }));
            } else {
              setValues((prev) => ({
                ...prev,
                projectName: event.target.value,
              }));
              setErrorMessage((prev) => ({
                ...prev,
                projectName: "",
              }));
            }
          }}
          errorMessage={errorMessage.projectName}
        />
      </div>
      <InputControl
        label="Project Duration"
        type="text"
        placeholder="Ex.6 Months,etc"
        value={values.projectDuration}
        onChange={(event) => {
          setValues((prev) => ({
            ...prev,
            projectDuration: event.target.value,
          }));
        }}
      />
      <div className={styles.row}>
        <InputControl
          label="Project Start Date"
          type="month"
          placeholder="Enter Start Date of Project"
          value={values.projectStartDate}
          onChange={(event) => {
            setValues((prev) => ({
              ...prev,
              projectStartDate: event.target.value,
            }));
          }}
        />
        <InputControl
          label="Project End Date"
          type="month"
          placeholder="Enter End Date of Project"
          value={values.projectEndDate}
          onChange={(event) => {
            console.log(event.target.value);
            setValues((prev) => ({
              ...prev,
              projectEndDate: event.target.value,
            }));
          }}
        />
      </div>
      <TextAreaControl
        label="Project Overview"
        isCompulsory={true}
        value={values.overview}
        placeholder="Enter Basic Overview of Project"
        rows="3"
        onChange={(event) => {
          if (event.target.value.trim() === "") {
            setErrorMessage((prev) => ({
              ...prev,
              overview: "Please Enter Overview of Project",
            }));
            setValues((prev) => ({
              ...prev,
              overview: event.target.value,
            }));
          } else {
            setValues((prev) => ({
              ...prev,
              overview: event.target.value,
            }));
            setErrorMessage((prev) => ({
              ...prev,
              overview: "",
            }));
          }
        }}
        errorMessage={errorMessage.overview}
      />
      <div className={styles.column}>
        <label>
          Enter Roles And Responsibility{" "}
          <span className={style.compulsory}>*</span>
        </label>
        <button onClick={() => handleAdd()}>
          <PlusCircle />
        </button>
        {values?.points?.length == 0 ? (
          <div className={styles.warning}>Enter Roles And Responsibilities</div>
        ) : (
          <span></span>
        )}

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
        isCompulsory={true}
        value={values.technology}
        placeholder="Technology Used"
        onChange={(event) => {
          if (event.target.value.trim() === "") {
            setErrorMessage((prev) => ({
              ...prev,
              technology: "Please Enter Technology Used In Project",
            }));
            setValues((prev) => ({
              ...prev,
              technology: event.target.value,
            }));
          } else {
            setValues((prev) => ({
              ...prev,
              technology: event.target.value,
            }));
            setErrorMessage((prev) => ({
              ...prev,
              technology: "",
            }));
          }
        }}
        errorMessage={errorMessage.technology}
      />
      <InputControl
        label="Technology You Worked On"
        isCompulsory={true}
        value={values.workedProjectTech}
        placeholder="Technology Used"
        onChange={(event) => {
          if (event.target.value.trim() === "") {
            setErrorMessage((prev) => ({
              ...prev,
              workedProjectTech:
                "Please Enter Technology You Worked On Project",
            }));
            setValues((prev) => ({
              ...prev,
              workedProjectTech: event.target.value,
            }));
          } else {
            setValues((prev) => ({
              ...prev,
              workedProjectTech: event.target.value,
            }));
            setErrorMessage((prev) => ({
              ...prev,
              workedProjectTech: "",
            }));
          }
        }}
        errorMessage={errorMessage.workedProjectTech}
      />
    </div>
  );

  const educationBody = (
    <div className={styles.detail}>
      <div className={styles.row}>
        <InputControl
          label="Education (Masters/Degree/Diploma)"
          isCompulsory={true}
          value={values.educationTitle}
          placeholder="For Ex. MCA,BTECH"
          onChange={(event) => {
            if (event.target.value.trim() === "") {
              setErrorMessage((prev) => ({
                ...prev,
                educationTitle: "Please Enter Masters/Degree/Diploma",
              }));
              setValues((prev) => ({
                ...prev,
                educationTitle: event.target.value,
              }));
            } else {
              setValues((prev) => ({
                ...prev,
                educationTitle: event.target.value,
              }));
              setErrorMessage((prev) => ({
                ...prev,
                educationTitle: "",
              }));
            }
          }}
          errorMessage={errorMessage.educationTitle}
        />
      </div>
      <InputControl
        label="University Name"
        value={values.college}
        placeholder="Enter name of your University/Board"
        onChange={(event) =>
          setValues((prev) => ({
            ...prev,
            college: event.target.value,
          }))
        }
      />
      <div className="col-6">
        <InputControl
          label="Pass Out Date"
          type="date"
          placeholder="Enter end date of this education"
          value={values.passOutDate}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              passOutDate: event.target.value,
            }))
          }
        />
      </div>
    </div>
  );

  const skillsBody = (
    <div className={styles.detail}>
      <div className={styles.column}>
        <label>
          Add Skills <span className={style.compulsory}>*</span>
        </label>
        <button onClick={() => handleAdd()}>
          <PlusCircle />
        </button>
        {values?.points?.length == 0 ? (
          <div className={styles.warning}>Enter Skills</div>
        ) : (
          <span></span>
        )}
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

  const certificationBody = (
    <div className={styles.detail}>
      <div className={styles.column}>
        <label>
          Add Certifications <span className={style.compulsory}>*</span>
        </label>
        <button onClick={() => handleAdd()}>
          <PlusCircle />
        </button>
        {values?.points?.length == 0 ? (
          <div className={styles.warning}>Enter Certifications</div>
        ) : (
          <span></span>
        )}
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
        if (isFieldInValid(values.experienceInYear)) {
          setErrorMessage((prev) => ({
            ...prev,
            experienceInYear: "Please Enter Year Of Experience",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            experienceInYear: "",
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

        if (
          values.name === "" ||
          values.title === "" ||
          values.profile === "" ||
          values.experienceInYear === ""
        )
          return;

        const tempDetail = {
          name: values.name,
          title: values.title,
          profile: values.profile,
          experienceInYear: values.experienceInYear,
          gender: values.gender,
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
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            startDate: "",
          }));
        }
        if (isFieldInValid(values.endDate)) {
          setErrorMessage((prev) => ({
            ...prev,
            endDate: "Please Enter End Date",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            endDate: "",
          }));
        }
        if (isFieldInValid(values.companyName)) {
          setErrorMessage((prev) => ({
            ...prev,
            companyName: "Please Enter Company Name",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            companyName: "",
          }));
        }
        if (isFieldInValid(values.role)) {
          setErrorMessage((prev) => ({
            ...prev,
            role: "Please Mention Designation",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            role: "",
          }));
        }

        if (
          values.role === "" ||
          values.companyName === "" ||
          values.startDate === "" ||
          values.endDate === ""
        )
          return;

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
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            projectName: "",
          }));
        }
        if (isFieldInValid(values.overview)) {
          setErrorMessage((prev) => ({
            ...prev,
            overview: "Please Enter Project Overview",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            overview: "",
          }));
        }
        if (isFieldInValid(values.technology)) {
          setErrorMessage((prev) => ({
            ...prev,
            technology: "Please Enter Project Technology",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            technology: "",
          }));
        }
        if (isFieldInValid(values.workedProjectTech)) {
          setErrorMessage((prev) => ({
            ...prev,
            workedProjectTech: "Please Enter Worked Techonology",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            workedProjectTech: "",
          }));
        }

        if (
          values.projectName === "" ||
          values.overview === "" ||
          values.technology === "" ||
          values.workedProjectTech === "" ||
          values.points.length === 0
        )
          return;

        const filteredPoints = values.points.filter(
          (item) => item.length !== 0
        );

        const tempDetail = {
          projectName: values.projectName,
          overview: values.overview,
          points: filteredPoints,
          technology: values.technology,
          workedProjectTech: values.workedProjectTech,
          projectStartDate: values.projectStartDate,
          projectEndDate: values.projectEndDate,
          projectDuration: values.projectDuration,
        };

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
        if (isFieldInValid(values.educationTitle)) {
          setErrorMessage((prev) => ({
            ...prev,
            educationTitle: "Please Enter Education Details",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            educationTitle: "",
          }));
        }

        const tempDetail = {
          educationTitle: values?.educationTitle,
          college: values?.college,
          passOutDate: values?.passOutDate,
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
        if (values.points.length === 0) return;

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
      case sections.certification: {
        if (values.points.length === 0) return;

        const filteredPoints = values.points.filter(
          (item) => item.length !== 0
        );

        setInformation((prev) => ({
          ...prev,
          [sections.certification]: {
            ...prev[sections.certification],
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
      case sections.certification:
        return certificationBody;
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
              handleSubmission();
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
        <button
          type="button"
          class="btn btn-primary"
          onClick={handleSubmission}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Editor;

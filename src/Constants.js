import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const PROFILE_DETAILS =
  "Passionate and Dedicated Candidate Looking for an Opportunity where I can apply my Skills and Knowledge to Enhance user experience, build Scalable products and Contribute to organization's Success.";

export const PROFILES = {
  internal: { title: "INTERNAL", color: "#35549c" },
  external: { title: "EXTERNAL", color: "#062e38" }
};

// API ROUTES
export const LOGIN_ENDPOINT = "/login";
export const PROFILE_LIST_ENDPOINT = "/api/profiles";
export const PROFILE_GET_ENDPOINT = "/api/profiles/";
export const PROJECT_LIST_ENDPOINT = "/api/profiles/:profile_id/projects";
export const EDUCATION_LIST_ENDPOINT = "/api/profiles/:profile_id/educations";
export const EXPERIENCE_LIST_ENDPOINT = "/api/profiles/:profile_id/experiences";
export const ACHIEVEMENT_LIST_ENDPOINT = "/api/profiles/:profile_id/achievements";
export const CERTIFICATE_LIST_ENDPOINT = "/api/profiles/:profile_id/certificates";

// HTTP METHODS
export const HTTP_METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT"
};

export const GENDER = [
  { label: "MALE", value: "Male" },
  { label: "FEMALE", value: "Female" },
  { label: "OTHER", value: "Other" }
];

export const DESIGNATION = [
  { lable: "intern", value: "Intern" },
  { lable: "software_engineer", value: "Software Engineer" },
  { lable: "sr_software_engineer", value: "Senior Software Engineer" },
  { lable: "tech_lead", value: "Technical Lead" },
  { lable: "project_manager", value: "Project Manager" },
  { lable: "product_manager", value: "Product Manager" },
  { lable: "qa", value: "Quality Assurance (QA) Engineer" },
  { lable: "devOps", value: "DevOps Engineer" }
];

export const SKILLS = [
  { label: ".NET", value: ".NET" },
  { label: "Android", value: "Android" },
  { label: "Angular", value: "Angular" },
  { label: "Business Analyst", value: "Business Analyst" },
  { label: "Data Science", value: "Data Science" },
  { label: "DevOps", value: "DevOps" },
  { label: "Flutter", value: "Flutter" },
  { label: "GO", value: "Go" },
  { label: "IOS", value: "IOS" },
  { label: "Java", value: "Java" },
  { label: "NodeJs", value: "NodeJs" },
  { label: "Python", value: "Python" },
  { label: "PHP", value: "PHP" },
  { label: "QA-Automation", value: "QA-Automation" },
  { label: "QA-Manual", value: "QA-Manual" },
  { label: "Ruby", value: "Ruby" },
  { label: "ReactJs", value: "ReactJs" },
  { label: "React-Native", value: "React-Native" },
  { label: "UI/UX", value: "UI/UX" },
  { label: "VueJs", value: "VueJs" }
];

export const ReducerPath = {
  profile: "profileApi",
  project:"projectApi",
  education:"educationApi",
  experience:"experienceApi",
  achievement:"achievementApi",
  certificate:"certificateApi"
};

export const TagTypes = {
  profile: "profiles",
  project:"projects",
  education:"educations",
  experience:"experiences",
  achievement:"achievements",
  certificate:"certificates"
};

// TODO : Remove once refactor
export const getMonthString = (num) => {
  let month; //Create a local variable to hold the string
  switch (num) {
    case 0:
      month = "January";
      break;
    case 1:
      month = "February";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "August";
      break;
    case 8:
      month = "September";
      break;
    case 9:
      month = "October";
      break;
    case 10:
      month = "November";
      break;
    case 11:
      month = "December";
      break;
    default:
      month = "Invalid month";
  }
  return month;
};

// ROUTES
export const ROOT_ROUTE = "/";
export const PROFILE_LIST_ROUTE = "/profiles";
export const DASHBOARD_ROUTE = "/dashboard";
export const EDITOR_ROUTE = "/profile-builder";
export const EDITOR_PROFILE_ROUTE = "/profile-builder/:profile_id";
export const ERROR_ROUTE = "*";

//Draggble Tabs
export const DraggableTabNode = ({ ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props["data-node-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
  };
  return React.cloneElement(props.children, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
};
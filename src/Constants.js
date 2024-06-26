export const PROFILE_DETAILS =
  "Passionate and Dedicated Candidate Looking for an Opportunity where I can apply my Skills and Knowledge to Enhance user experience, build Scalable products and Contribute to organization's Success.";

export const PROFILES = {
  internal: { title: "INTERNAL", color: "#35549c" },
  external: { title: "EXTERNAL", color: "#062e38" }
};

// ROUTES
export const ROOT_ROUTE = "/";
export const PROFILE_LIST_ROUTE = "/profiles";
export const DASHBOARD_ROUTE = "/dashboard";
export const EDITOR_ROUTE = "/profile-builder";
export const EDITOR_PROFILE_ROUTE = "/profile-builder/:profile_id";
export const ERROR_ROUTE = "*";

// API ROUTES
export const LOGIN_ENDPOINT = "/login";
export const PROFILE_LIST_ENDPOINT = "/api/profiles";
export const CREATE_PROFILE_ENDPOINT = "/api/profiles";
export const CREATE_ACHIEVEMENT_ENDPOINTS =
  "/api/profiles/:profile_id/achievements";
export const CREATE_CERTIFICATE_ENDPOINTS =
  "/api/profiles/:profile_id/certificates";
export const CREATE_EDUCATION_ENDPOINTS =
  "/api/profiles/:profile_id/educations";
export const CREATE_EXPERIENCE_ENDPOINTS =
  "/api/profiles/:profile_id/experiences";
export const CREATE_PROJECT_ENDPOINTS = "/api/profiles/:profile_id/projects";

export const PROFILE_GET_ENDPOINT = "/api/profiles/:profile_id";
export const PROJECT_LIST_ENDPOINT = "/api/profiles/:profile_id/projects";
export const EDUCATION_LIST_ENDPOINT = "/api/profiles/:profile_id/educations";
export const EXPERIENCE_LIST_ENDPOINT = "/api/profiles/:profile_id/experiences";
export const ACHIEVEMENT_LIST_ENDPOINT =
  "/api/profiles/:profile_id/achievements";
export const CERTIFICATE_LIST_ENDPOINT =
  "/api/profiles/:profile_id/certificates";

// HTTP METHODS
export const HTTP_METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT"
};
// Redux Toolkit Query
export const LOGIN_REDUCER_PATH = "loginApi";
export const PROFILE_REDUCER_PATH = "profileApi";
export const ACHIEVEMENT_REDUCER_PATH = "achievementApi";
export const CERTIFICATE_REDUCER_PATH = "certificateApi";
export const EDUCATION_REDUCER_PATH = "educationApi";
export const EXPERIENCE_REDUCER_PATH = "experienceApi";
export const PROJECT_REDUCER_PATH = "projectApi";

// Redux Tag Types
export const LOGIN_TAG_TYPES = ["login"];
export const PROFILE_TAG_TYPES = ["profile"];
export const ACHIEVEMENT_TAG_TYPES = ["achievement"];
export const CERTIFICATE_TAG_TYPES = ["certificate"];
export const EDUCATION_TAG_TYPES = ["education"];
export const EXPERIENCE_TAG_TYPES = ["experience"];
export const PROJECT_TAG_TYPES = ["project"];

// ERRORS
export const INVALID_ID_ERROR = "Invalid or missing ID";
export const NETWORK_ERROR = "Network Error";

// Keywords
export const BASIC_INFO_KEY = "basic-info";
export const PROJECTS_KEY = "projects";
export const EDUCATION_KEY = "education";
export const EXPERIENCE_KEY = "experience";
export const ACHIEVEMENT_KEY = "achievement";
export const CERTIFICATION_KEY = "certification";

// Keywords
export const BASIC_INFO_LABEL = "Basic Info";
export const PROJECTS_LABEL = "projects";
export const EDUCATION_LABEL = "education";
export const EXPERIENCE_LABEL = "experience";
export const ACHIEVEMENT_LABEL = "achievement";
export const CERTIFICATION_LABEL = "certification";

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

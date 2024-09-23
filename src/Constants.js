export const PROFILE_DETAILS =
  "Passionate and Dedicated Candidate Looking for an Opportunity where I can apply my Skills and Knowledge to Enhance user experience, build Scalable products and Contribute to organization's Success.";

export const PROFILES = {
  internal: { title: "INTERNAL", color: "#35549c" },
  external: { title: "EXTERNAL", color: "#062e38" },
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
export const LOGOUT_ENDPOINT = "/api/logout";
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
export const EMPLOYEE_INVITE_ENDPOINT =
  "/api/profiles/:profile_id/employee_invite";
export const PROFILE_COMPLETE_ENDPOINT =
  "/api/profiles/:profile_id/profile_complete";

export const PROFILE_GET_ENDPOINT = "/api/profiles/:profile_id";
export const PROJECT_LIST_ENDPOINT = "/api/profiles/:profile_id/projects";
export const EDUCATION_LIST_ENDPOINT = "/api/profiles/:profile_id/educations";
export const EXPERIENCE_LIST_ENDPOINT = "/api/profiles/:profile_id/experiences";
export const ACHIEVEMENT_LIST_ENDPOINT =
  "/api/profiles/:profile_id/achievements";
export const CERTIFICATE_LIST_ENDPOINT =
  "/api/profiles/:profile_id/certificates";

export const UPDATE_PROFILE_ENDPOINT = "/api/profiles/:profile_id";
export const UPDATE_ACHIEVEMENT_ENDPOINT =
  "/api/profiles/:profile_id/achievements/:achievement_id";
export const UPDATE_PROJECT_ENDPOINT =
  "/api/profiles/:profile_id/projects/:project_id";
export const UPDATE_EDUCATION_ENDPOINT =
  "/api/profiles/:profile_id/educations/:education_id";
export const UPDATE_EXPERIENCE_ENDPOINT =
  "/api/profiles/:profile_id/experiences/:experience_id";
export const UPDATE_CERTIFICATE_ENDPOINT =
  "/api/profiles/:profile_id/certificates/:certificate_id";
export const UPDATE_SEQUENCE_ENDPOINT = "/api/updateSequence";

export const DELETE_PROFILE_ENDPOINT = "/api/profiles/:profile_id";
export const DELETE_ACHIEVEMENT_ENDPOINT =
  "/api/profiles/:profile_id/achievements/:achievement_id";
export const DELETE_PROJECT_ENDPOINT =
  "/api/profiles/:profile_id/projects/:project_id";
export const DELETE_EDUCATION_ENDPOINT =
  "/api/profiles/:profile_id/educations/:education_id";
export const DELETE_EXPERIENCE_ENDPOINT =
  "/api/profiles/:profile_id/experiences/:experience_id";
export const DELETE_CERTIFICATE_ENDPOINT =
  "/api/profiles/:profile_id/certificates/:certificate_id";

// HTTP METHODS
export const HTTP_METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};
// Redux Toolkit Query
export const LOGIN_REDUCER_PATH = "loginApi";
export const PROFILE_REDUCER_PATH = "profileApi";
export const ACHIEVEMENT_REDUCER_PATH = "achievementApi";
export const CERTIFICATE_REDUCER_PATH = "certificateApi";
export const EDUCATION_REDUCER_PATH = "educationApi";
export const EXPERIENCE_REDUCER_PATH = "experienceApi";
export const PROJECT_REDUCER_PATH = "projectApi";
export const USER_EMAIL_REDUCER_PATH = "userEmailApi";

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
export const PRESENT_VALUE = "present";
export const WHOLE_NO_VALIDATOR = /^[0-9]+$/;

// Keywords
export const BASIC_INFO_LABEL = "Basic Info";
export const PROJECTS_LABEL = "Projects";
export const EDUCATION_LABEL = "Education";
export const EXPERIENCE_LABEL = "Experience";
export const ACHIEVEMENT_LABEL = "Achievement";
export const CERTIFICATION_LABEL = "Certification";
export const DELETING_SPIN = "Deleting...";
export const LOADING_SPIN = "Loading...";
export const SPIN_SIZE = "large";
export const ADMIN = "admin";
export const EMPLOYEE = "employee";

export const GENDER = [
  { label: "MALE", value: "Male" },
  { label: "FEMALE", value: "Female" },
  { label: "OTHER", value: "Other" },
];

export const SUCCESS_TOASTER = {
  icon: "✅",
  style: {
    border: "1px solid #000000",
    padding: "16px",
    color: "#000000",
  },
  iconTheme: {
    primary: "#713200",
    secondary: "#FFFAEE",
  },
};

export const WARNING_TOASTER = {
  icon: "⚠️",
  style: {
    border: "1px solid #000000",
    padding: "16px",
    color: "#000000",
  },
  iconTheme: {
    primary: "#713200",
    secondary: "#FFFAEE",
  },
};

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
  { label: "VueJs", value: "VueJs" },
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

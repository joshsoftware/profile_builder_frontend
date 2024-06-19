export const PROFILE_DETAILS =
  "Passionate and Dedicated Candidate Looking for an Opportunity where I can apply my Skills and Knowledge to Enhance user experience, build Scalable products and Contribute to organization's Success.";

export const PROFILES = {
  internal: { title: "INTERNAL", color: "#35549c" },
  external: { title: "EXTERNAL", color: "#062e38" },
};

export const GENDER = [
  { label: "MALE", value: "Male" },
  { label: "FEMALE", value: "Female" },
  { label: "OTHER", value: "Other" },
];

export const DESIGNATION = [
  { lable: "intern", value: "Intern" },
  { lable: "software_engineer", value: "Software Engineer" },
  { lable: "sr_software_engineer", value: "Senior Software Engineer" },
  { lable: "tech_lead", value: "Technical Lead" },
  { lable: "project_manager", value: "Project Manager" },
  { lable: "product_manager", value: "Product Manager" },
  { lable: "qa", value: "Quality Assurance (QA) Engineer" },
  { lable: "devOps", value: "DevOps Engineer" },
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
  { label: "VueJs", value: "VueJs" },
];

export const ROUTES = {
  profile: "/api/profiles",
  project:"/profiles/2/projects",
  education:"/profiles/2/educations",
  experience:"/profiles/2/experiences",
  achievement:"/profiles/2/achievements",
  certificate:"/profiles/2/certificates"
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

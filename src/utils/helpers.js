export const genderOptions = [
  { label: "CHOOSE GENDER", value: "" },
  { label: "MALE", value: "Male" },
  { label: "FEMALE", value: "Female" },
  { label: "OTHER", value: "Other" },
];
//ReactJs, Angular, Flutter, .Net, NodeJs, React-Native, VueJs
export const skillsOptions = [
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

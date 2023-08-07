export const genderOptions = [
  { name: "MALE", value: "Male" },
  { name: "FEMALE", value: "Female" },
  { name: "OTHER", value: "Other" },
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

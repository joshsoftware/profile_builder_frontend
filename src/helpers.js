import dayjs from "dayjs";
import { PRESENT_VALUE } from "./Constants";

export const filterSection = (values) => {
  return Object.entries(values).reduce((acc, [, section]) => {
    if (!section?.id) {
      acc.push(section);
    }
    return acc;
  }, []);
};

// Format the project data
export const formatProjectsFields = (projects) => {
  return projects.map((project) => ({
    name: project.name,
    description: project.description,
    role: project.role,
    responsibilities: project.responsibilities,
    technologies: project.technologies,
    tech_worked_on: project.tech_worked_on,
    working_start_date: project.working_start_date
      ? project.working_start_date.format("MMM-YYYY")
      : null,
    working_end_date: project.working_end_date
      ? project.working_end_date.format("MMM-YYYY")
      : null,
    duration: project.duration,
  }));
};

// Format the experience data
export const formatExperienceFields = (experiences) => {
  return experiences.map((experience) => ({
    designation: experience?.designation,
    company_name: experience?.company_name,
    from_date: experience?.from_date?.format("MMM-YYYY"),
    to_date: experience?.to_date
      ? experience?.to_date?.format("MMM-YYYY")
      : PRESENT_VALUE,
  }));
};

// Format the education data
export const formatEducationFields = (educations) => {
  return educations.map((education) => ({
    degree: education?.degree,
    university_name: education?.university_name,
    place: education?.place,
    percent_or_cgpa: education?.percent_or_cgpa,
    passing_year: education?.passing_year,
  }));
};

// format the certification data
export const formatCertificationFields = (certifications) => {
  return certifications.map((certificate) => ({
    name: certificate?.name,
    organization_name: certificate?.organization_name,
    description: certificate?.description,
    issued_date: certificate?.issued_date?.format("MMM-YYYY"),
    from_date: certificate?.from_date?.format("MMM-YYYY"),
    to_date: certificate?.to_date?.format("MMM-YYYY"),
  }));
};

// format the achievement data
export const formatAchievementFields = (achievements) => {
  return achievements.map((achievement) => ({
    name: achievement?.name,
    description: achievement?.description,
  }));
};

export const validateId = (id) => {
  return id && typeof id === "string" && id.trim() !== "";
};

export const disabledDate = (current) => {
  // Can not select month before today and today
  return current && current < dayjs().endOf("month");
};

export const calculateTotalExperience = (pastExp, joinDate) => {
  const pastExperienceInMonths = pastExp || 0;
  const joiningDate = joinDate ? new Date(joinDate) : new Date();
  const currentDate = new Date();

  const diffYears = currentDate.getFullYear() - joiningDate.getFullYear();
  const diffMonths = currentDate.getMonth() - joiningDate.getMonth();
  const monthsSinceJoining = diffYears * 12 + diffMonths;

  const totalExperienceInMonths =
    Number(pastExperienceInMonths) + Number(monthsSinceJoining);
  const totalExperienceInYears = totalExperienceInMonths / 12;
  const result = Math.floor(totalExperienceInYears);

  if (result === 0) {
    return 1;
  } else {
    return result;
  }
};

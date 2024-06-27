import React from "react";
import { Space, Tag } from "antd";

export const validateId = (id) => {
  return id && typeof id === "string" && id.trim() !== "";
};

export const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text) => <a>{text}</a>
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Years of Experience",
    dataIndex: "years_of_experience",
    key: "years_of_experience"
  },
  {
    title: "Primary Skills",
    key: "primary_skills",
    dataIndex: "primarySkills",
    render: (_, { primary_skills }) => (
      <>
        {primary_skills.map((tag, index) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "python") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={`${tag}-${index}`}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    )
  },
  {
    title: "Is Current Employee",
    dataIndex: "is_current_employee",
    key: "is_current_employee",
    render: (is_current_employee) => (
      <strong>{is_current_employee === 1 ? "YES" : "NO"}</strong>
    )
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    )
  }
];

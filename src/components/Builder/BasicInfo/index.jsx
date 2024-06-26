import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import PropTypes from "prop-types"; // Import PropTypes
import { useCreateProfileMutation } from "../../../api/profileApi";
import {
  DESIGNATION,
  EDITOR_PROFILE_ROUTE,
  GENDER,
  PROFILE_DETAILS,
  SKILLS
} from "../../../Constants";
import { ResumeContext } from "../../../utils/ResumeContext";

const BasicInfo = ({ profileData }) => {
  const [createProfileService] = useCreateProfileMutation();
  const [form] = Form.useForm();
  const { initialState, setInitialState } = useContext(ResumeContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (profileData) {
      form.setFieldsValue(profileData.profile);
    }
  }, [profileData]);

  const onFinish = async (values) => {
    if (values.years_of_experience) {
      values.years_of_experience = parseFloat(values.years_of_experience);
    }
    setInitialState({
      ...initialState,
      basicInfo: { ...initialState.basicInfo, ...values }
    });
    var profile = { profile: { ...initialState.basicInfo, ...values } };

    try {
      const response = await createProfileService(values);
      if (response.data?.message) {
        toast.success(response.data?.message);
        navigate(
          EDITOR_PROFILE_ROUTE.replace(":id", response.data?.profile_id)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  const onReset = () => {
    form.resetFields();
    setInitialState({
      ...initialState,
      basicInfo: {
        profileDetails: PROFILE_DETAILS
      }
    });
  };

  return (
    <Form layout="vertical" form={form} name="basic-info" onFinish={onFinish}>
      <Row>
        <Col span={11}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              {
                required: true,
                message: "Name required"
              }
            ]}
          >
            <Input placeholder="First Middle Last" />
          </Form.Item>
        </Col>
        <Col span={11} offset={2}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Email required"
              }
            ]}
          >
            <Input type="email" placeholder="example@joshsoftware.com" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={11}>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              {
                required: true,
                message: "Mobile required"
              }
            ]}
          >
            <Input type="tel" placeholder="Enter mobile no" />
          </Form.Item>
        </Col>
        <Col span={11} offset={2}>
          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select gender" options={GENDER} allowClear />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={11}>
          <Form.Item
            name="years_of_experience"
            label="Year Of Experience"
            rules={[
              {
                required: true,
                message: "Experience required"
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value <= 30) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Maximum experience is 30 years.")
                  );
                }
              })
            ]}
          >
            <Input type="number" placeholder="Enter experience (eg. 2.5, 1)" />
          </Form.Item>
        </Col>
        <Col span={11} offset={2}>
          <Form.Item name="designation" label="Designation">
            <Select
              placeholder="Select designation"
              options={DESIGNATION}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={11}>
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: "Title required"
              }
            ]}
          >
            <Input placeholder="Backend Developer, Data Analyst, etc." />
          </Form.Item>
        </Col>
        <Col span={11} offset={2}>
          <Form.Item name="linkedin_link" label="LinkedIn Profile Link">
            <Input placeholder="Enter linkedin profile link" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={11}>
          <Form.Item name="github_link" label="Github Profile Link">
            <Input placeholder="Enter github profile link" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="description"
        label="Description"
        initialValue={PROFILE_DETAILS}
      >
        <Input.TextArea
          maxLength={600}
          style={{ height: 120, resize: "none" }}
        />
      </Form.Item>
      <Form.Item
        name="primary_skills"
        label="Add Primary Skills"
        style={{ width: "100%" }}
      >
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Please select primary skills"
          options={SKILLS}
        />
      </Form.Item>
      <Form.Item
        name="secondary_skills"
        label="Add Secondary Skills"
        style={{ width: "100%" }}
      >
        <Select mode="tags" style={{ width: "100%" }} placeholder="Tags Mode" />
      </Form.Item>
      <Form.Item name="career_objectives" label="Career Objectives">
        <Input.TextArea
          placeholder="Please provide career objectives"
          showCount
          maxLength={300}
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

BasicInfo.propTypes = {
  profileData: PropTypes.shape({
    profile: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string,
      gender: PropTypes.string,
      years_of_experience: PropTypes.number,
      designation: PropTypes.string,
      title: PropTypes.string,
      linkedin_link: PropTypes.string,
      github_link: PropTypes.string,
      description: PropTypes.string,
      primary_skills: PropTypes.array,
      secondary_skills: PropTypes.array,
      career_objectives: PropTypes.string
    })
  })
};

export default BasicInfo;

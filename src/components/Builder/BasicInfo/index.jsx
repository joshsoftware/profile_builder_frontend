import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import PropTypes from "prop-types";
import {
  DESIGNATION,
  GENDER,
  PROFILE_DETAILS,
  PROFILE_LIST_ENDPOINT,
  SKILLS,
} from "../../../Constants";
import { post } from "../../../services/axios";
import { ResumeContext } from "../../../utils/ResumeContext";

const BasicInfo = ({ profileData }) => {
  const { initialState, setInitialState } = useContext(ResumeContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (profileData) {
      form.setFieldsValue(profileData.profile);
    }
  }, [profileData, form]);

  const onFinish = async (values) => {
    if (values.years_of_experience) {
      values.years_of_experience = parseFloat(values.years_of_experience);
    }

    const updatedBasicInfo = {
      ...initialState.basicInfo,
      ...values,
    };
    setInitialState({
      ...initialState,
      basicInfo: updatedBasicInfo,
    });

    try {
      await post(PROFILE_LIST_ENDPOINT, { profile: updatedBasicInfo });
      navigate(PROFILE_LIST_ENDPOINT);
    } catch (error) {
      console.error("Error posting basic info:", error);
    }
  };

  const onReset = () => {
    // Handle form reset
    form.resetFields();
    setInitialState({
      ...initialState,
      basicInfo: {
        profileDetails: PROFILE_DETAILS,
      },
    });
  };

  return (
    <Form
      layout="vertical"
      form={form}
      name="basic-info"
      onFinish={onFinish}
      initialValues={
        profileData?.profile || { profileDetails: PROFILE_DETAILS }
      }
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Name required" }]}
          >
            <Input placeholder="First Middle Last" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Valid email required",
              },
            ]}
          >
            <Input placeholder="example@joshsoftware.com" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[{ required: true, message: "Mobile number required" }]}
          >
            <Input type="tel" placeholder="Enter mobile number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select gender" options={GENDER} allowClear />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="years_of_experience"
            label="Years of Experience"
            rules={[
              { required: true, message: "Experience required" },
              {
                validator: (_, value) =>
                  value <= 30
                    ? Promise.resolve()
                    : Promise.reject("Maximum experience is 30 years."),
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter experience (e.g., 2.5, 1)"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="designation" label="Designation">
            <Select
              placeholder="Select designation"
              options={DESIGNATION}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title required" }]}
          >
            <Input placeholder="Backend Developer, Data Analyst, etc." />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="linkedin_link" label="LinkedIn Profile Link">
            <Input placeholder="Enter LinkedIn profile link" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="github_link" label="Github Profile Link">
            <Input placeholder="Enter GitHub profile link" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
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
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="primary_skills" label="Primary Skills">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select primary skills"
              options={SKILLS}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="secondary_skills" label="Secondary Skills">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Add secondary skills"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="career_objectives" label="Career Objectives">
            <Input.TextArea
              placeholder="Provide career objectives"
              maxLength={300}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>
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
      career_objectives: PropTypes.string,
    }),
  }),
};

export default BasicInfo;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import {
  useCreateProfileMutation,
  useUpdateProfileMutation,
} from "../../../api/profileApi";
import {
  ADMIN,
  EDITOR_PROFILE_ROUTE,
  GENDER,
  PROFILE_DETAILS,
  SKILLS,
  SUCCESS_TOASTER,
} from "../../../Constants";
import { parseDate } from "../../../helpers";

const BasicInfo = ({ profileData, onLiveChange }) => {
  const role = useSelector((state) => state.auth.role);
  const [createProfileService, { isLoading: isCreating }] =
    useCreateProfileMutation();
  const [updateProfileService, { isLoading: isUpdating }] =
    useUpdateProfileMutation();
  const [formChange, setFormChange] = useState(false);
  const [showIntranetBanner, setShowIntranetBanner] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const intranetData = location.state?.intranetData;

  useEffect(() => {
    if (profileData) {
      const profileDataCopy = { ...profileData };
      profileDataCopy.josh_joining_date = parseDate(
        profileDataCopy.josh_joining_date,
      );
      form.setFieldsValue(profileDataCopy);
      if (onLiveChange) {
        onLiveChange({ ...profileDataCopy });
      }
    } else if (!intranetData) {
      if (onLiveChange) {
        onLiveChange({ description: PROFILE_DETAILS });
      }
    }
  }, [profileData, form, intranetData, onLiveChange]);

  // Pre-fill from Intranet data when coming from the sync flow
  useEffect(() => {
    if (intranetData && !profileData) {
      const initialValues = {
        name:                intranetData.name,
        email:               intranetData.email,
        employee_id:         intranetData.employeeId,
        mobile:              intranetData.mobileNumber,
        gender:              intranetData.gender,
        years_of_experience: intranetData.yearsOfExperience,
        designation:         intranetData.designation,
        linkedin_link:       intranetData.linkedinUrl,
        github_link:         intranetData.githubUrl,
        primary_skills:      intranetData.primarySkills ?? [],
        secondary_skills:    intranetData.secondarySkills ?? [],
        josh_joining_date:   intranetData.joshJoiningDate
                               ? dayjs(intranetData.joshJoiningDate)
                               : undefined,
      };
      form.setFieldsValue(initialValues);
      setShowIntranetBanner(true);
      if (onLiveChange) {
        onLiveChange({ description: PROFILE_DETAILS, ...initialValues });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intranetData]);

  const onFinish = async (values) => {
    try {
      if (values.years_of_experience || values.josh_joining_date) {
        values.years_of_experience = Number(values.years_of_experience);
        if (values.josh_joining_date) {
          if (!dayjs.isDayjs(values.josh_joining_date)) {
            values.josh_joining_date = dayjs(values.josh_joining_date);
          }
          values.josh_joining_date =
            values.josh_joining_date.format("MMM-YYYY");
        }
      }

      if (values.employee_id && typeof values.employee_id === "string") {
        values.employee_id = values.employee_id.trim();
      }

      let response;
      if (profileData) {
        if (formChange) {
          response = await updateProfileService({
            profile_id: profileData.id,
            values,
          });
        } else {
          toast.success("No new changes detected.");
        }
      } else {
        response = await createProfileService(values);
      }

      if (response?.data?.message) {
        toast.success(response.data?.message, SUCCESS_TOASTER);
        navigate(
          EDITOR_PROFILE_ROUTE.replace(
            ":profile_id",
            response.data?.profile_id,
          ),
        );
        setFormChange(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      name="basic-info"
      onFinish={onFinish}
      onValuesChange={(_, allValues) => {
        setFormChange(true);
        if (onLiveChange) {
          onLiveChange({ ...profileData, ...allValues });
        }
      }}
      initialValues={profileData || { description: PROFILE_DETAILS }}
    >
      {/* Intranet pre-fill info banner */}
      {showIntranetBanner && (
        <Alert
          message="Form pre-filled from Intranet data. Please review and complete the remaining fields."
          type="info"
          showIcon
          closable
          onClose={() => setShowIntranetBanner(false)}
          style={{ marginBottom: "20px" }}
        />
      )}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Name required" }]}
          >
            <Input placeholder="First Middle Last" />
          </Form.Item>
        </Col>
        <Col span={8}>
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
        <Col span={8}>
          <Form.Item
            name="employee_id"
            label="Employee ID"
          >
            <Input
              placeholder="e.g. 101 or JIN1001"
              disabled={role?.toLowerCase() !== ADMIN}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              { required: true, message: "Mobile number required" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Mobile number must be exactly 10 digits",
              },
            ]}
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
            label="Past Years Of Experience (Before Josh) "
            rules={[
              { required: true, message: "Experience required" },
              {
                validator: async (_, value) => {
                  if (value !== undefined && value !== null && Number(value) < 0) {
                    return Promise.reject(new Error("Experience cannot be negative"));
                  }
                  return Promise.resolve();
                },
              }
            ]}
            tooltip={{
              title: "If the Josh is your first organization, enter 0",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input
              type="number"
              placeholder="Enter experience (e.g., 1, 2 , 0.2 etc.)"
              min={0}
              step={0.1}
              onKeyDown={(e) => {
                if (e.key === "-") {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="designation" label="Designation">
            <Input placeholder="Software Engineer, etc." />
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
          <Form.Item
            name="linkedin_link"
            label="LinkedIn Profile Link"
            rules={[
              {
                max: 100,
                message: "LinkedIn profile link cannot exceed 100 characters",
              },
            ]}
          >
            <Input placeholder="Enter LinkedIn profile link" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="josh_joining_date" label="JOSH Joining Date">
            <DatePicker style={{ width: "100%" }} picker="month" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="github_link"
            label="Github Profile Link"
            rules={[
              {
                max: 100,
                message: "GitHub profile link cannot exceed 100 characters",
              },
            ]}
          >
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
            rules={[{ required: true, message: "Description required" }]}
          >
            <Input.TextArea
              minLength={50}
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
              tokenSeparators={[","]}
              rules={[
                {
                  required: true,
                  message: "At least one primary skill is required",
                },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="secondary_skills" label="Secondary Skills">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Add secondary skills"
              tokenSeparators={[","]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="career_objectives" label="Career Objectives">
            <Input.TextArea
              placeholder="Provide career objectives"
              minLength={50}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating}
            disabled={!!profileData}
          >
            Create
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isUpdating}
            disabled={!profileData}
          >
            Update
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

BasicInfo.propTypes = {
  profileData: PropTypes.shape({
    id: PropTypes.number,
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
      employee_id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
    josh_joining_date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }),
  onLiveChange: PropTypes.func,
};

export default BasicInfo;

import React, { useContext } from "react";
import { Button, Col, Form, Input, Row, Select, Space } from "antd";

import { post } from "../../services/axios";
import { ResumeContext } from "../../utils/ResumeContext";
import { DESIGNATION, GENDER, PROFILE_DETAILS, ROUTES } from "../../Constants";

const { Option } = Select;

const BasicInfo = () => {
  const [form] = Form.useForm();
  const { initialState, setInitialState } = useContext(ResumeContext);

  const onFinish = (values) => {
    setInitialState({
      ...initialState,
      basicInfo: { ...initialState.basicInfo, ...values },
    });

    post(ROUTES.profile, initialState);
  };

  const onReset = () => {
    form.resetFields();
    setInitialState({
      ...initialState,
      basicInfo: {
        profileDetails: PROFILE_DETAILS,
      },
    });
  };
  return (
    <Form layout="vertical" form={form} name="basic-info" onFinish={onFinish}>
      <Row>
        <Col span={11}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              {
                required: true,
                message: "Name can not be blank",
              },
            ]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>
        </Col>
        <Col span={11} offset={2}>
          <Form.Item
            name="designation"
            label="Designation"
            rules={[
              {
                required: true,
                message: "Designation can not be blank",
              },
            ]}
          >
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
            name="experience"
            label="Year Of Experience"
            rules={[
              {
                required: true,
                message: "Experience cannot be blank",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value <= 30) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Maximum experience is 30 years.")
                  );
                },
              }),
            ]}
          >
            <Input type="number" placeholder="Enter your experience" />
          </Form.Item>
        </Col>
        <Col span={11} offset={2}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: "Please select gender",
              },
            ]}
          >
            <Select placeholder="Select gender" options={GENDER} allowClear />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="profileDetails"
        label="Profile Details"
        initialValue={PROFILE_DETAILS}
        rules={[
          { required: true, message: "Profile details can not be blank " },
        ]}
      >
        <Input.TextArea
          maxLength={600}
          style={{ height: 120, resize: "none" }}
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

export default BasicInfo;

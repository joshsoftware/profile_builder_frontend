import React, { useContext } from "react";

import { Button, Col, Form, Input, Row, Space } from "antd";

import { ROUTES } from "../../../Constants";
import { post } from "../../../services/axios";
import { ResumeContext } from "../../../utils/ResumeContext";

// const { Option } = Select;

const Education = () => {
  const { initialState, setInitialState } = useContext(ResumeContext);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    setInitialState({
      ...initialState,
      education: { ...initialState.education, ...values },
    });
    post(ROUTES.profile, initialState);
    form.resetFields();
  };

  const onReset = () => {
    form.resetFields();
    setInitialState({
      ...initialState,
      education: {},
    });
  };

  return (
    <Form layout="vertical" form={form} name="education" onFinish={onFinish}>
      <Form.Item
        name="educationName"
        label="Education (Masters/Degree/Diploma)"
        rules={[
          {
            required: true,
            message: "Education (Masters/Degree/Diploma) can not be blank",
          },
        ]}
      >
        <Input placeholder="For Ex. MCA,BTECH" />
      </Form.Item>
      <Form.Item
        name="universityName"
        label="University Name"
        rules={[
          {
            required: true,
            message: "University Name can not be blank",
          },
        ]}
      >
        <Input placeholder="Enter name of your University/Board" />
      </Form.Item>
      <Row>
        <Col span={11}>
          <Form.Item
            name="percentage"
            label="CGPA/Percentage (%)"
            rules={[
              {
                required: true,
                message: "Percentage can not be blank",
              },
            ]}
          >
            <Input type="number" placeholder="9.2 Or 89%" />
          </Form.Item>
        </Col>
        <Col span={11} offset={2}>
          <Form.Item
            name="passYear"
            label="Passout Year"
            rules={[
              {
                required: true,
                message: "Passout Year can not be blank",
              },
            ]}
          >
            <Input type="number" placeholder="2024" />
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
export default Education;

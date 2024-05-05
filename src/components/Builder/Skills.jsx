import React, { useContext } from "react";
import { Button, Form, Select, Space } from "antd";

import { ResumeContext } from "../../utils/ResumeContext";
import { ROUTES, SKILLS } from "../../Constants";
import { post } from "../../services/axios";

const Skills = () => {
  const { initialState, setInitialState } = useContext(ResumeContext);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    setInitialState({
      ...initialState,
      skills: Object.values(values).flat(),
    });

    post(ROUTES.profile, initialState);
    form.resetFields();
  };

  return (
    <Form layout="vertical" form={form} name="skills" onFinish={onFinish}>
      <Form.Item
        name="skills"
        label="Add Skills"
        style={{ width: "100%" }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          mode="multiple"
          style={{
            width: "100%",
          }}
          placeholder="Please select skills"
          options={SKILLS}
        />
      </Form.Item>
      <Form.Item
        name="otherSkills"
        label="Add Other Skills"
        style={{ width: "100%" }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select mode="tags" style={{ width: "100%" }} placeholder="Tags Mode" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Skills;

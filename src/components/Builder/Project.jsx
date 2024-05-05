import React, { useContext } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import style from "./Builder.module.css";
import { ResumeContext } from "../../utils/ResumeContext";
import { ROUTES } from "../../Constants";
import { post } from "../../services/axios";

const Project = () => {
  const { initialState, setInitialState } = useContext(ResumeContext);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    setInitialState({
      ...initialState,
      projects: { ...initialState.projects, ...values },
    });

    post(ROUTES.profile, initialState);
    form.resetFields();
  };

  const onReset = () => {
    form.resetFields();
    setInitialState({
      ...initialState,
      projects: {},
    });
  };

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        name="project-info  "
        onFinish={onFinish}
      >
        <Form.Item
          name="projectName"
          label="Project Name"
          rules={[
            {
              required: true,
              message: "Profile name can not be blank",
            },
          ]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>
        <Form.Item
          name="projectDuration"
          label="Project Duration (in years)"
          rules={[
            {
              required: true,
              message: "Profile duration can not be blank",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value <= 10) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Maximum duration is 10 years.")
                );
              },
            }),
          ]}
        >
          <Input type="number" placeholder="Ex. 6 Months, etc" />
        </Form.Item>
        <Form.Item
          name="profileOverview"
          label="Profile Overview"
          rules={[
            {
              required: true,
              message: "Profile overview can not be blank",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Please basic overview of project"
            showCount
            maxLength={300}
          />
        </Form.Item>
        <Space className={style.certificationTitle}>
          <Typography.Text>
            <small className={style.mandetory}>*</small>Add Responsibility
          </Typography.Text>
        </Space>
        <Form.List label="Responsibility" name="responsibility">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row>
                  <Col span={22}>
                    <Form.Item
                      {...restField}
                      name={[name, "first"]}
                      rules={[
                        {
                          required: true,
                          message: "Responsibility can not be blank",
                        },
                      ]}
                    >
                      <Input placeholder={`Responsibility ${key + 1}`} />
                    </Form.Item>
                  </Col>
                  <Col
                    span={1}
                    offset={1}
                    style={{ marginTop: "5px", float: "right" }}
                  >
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add responsibility
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Row>
          <Col span={11}>
            <Form.Item
              name="projectStartDate"
              label="Project Start Date"
              rules={[
                {
                  required: true,
                  message: "Start date can not be blank",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="projectEndDate"
              label="Project End Date"
              rules={[
                {
                  required: true,
                  message: "End date can not be blank",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="projectTech"
          label="Project Technology"
          rules={[
            {
              required: true,
              message: "Project technology required",
            },
          ]}
        >
          <Input placeholder="Project Technology" />
        </Form.Item>
        <Form.Item
          name="workedTech"
          label="Technology You Worked On"
          rules={[
            {
              required: true,
              message: "Worked technology required",
            },
          ]}
        >
          <Input placeholder="Technology Used" />
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
    </div>
  );
};

export default Project;

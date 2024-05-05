import React, { useContext, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
} from "antd";
import { ResumeContext } from "../../utils/ResumeContext";
import { DESIGNATION } from "../../Constants";

const Experience = () => {
  const { initialState, setInitialState } = useContext(ResumeContext);
  const [form] = Form.useForm();

  const [isCurrentCompany, setIsCurrentCompany] = useState(true);

  const onFinish = (values) => {
    setInitialState({
      ...initialState,
      workExperience: { ...initialState.workExperience, ...values },
    });
  };

  const onReset = () => {
    form.resetFields();
    setInitialState({
      ...initialState,
      workExperience: {},
    });
  };

  const onChange = (e) => {
    setIsCurrentCompany(e.target.checked);
  };

  return (
    <Form layout="vertical" form={form} name="experience" onFinish={onFinish}>
      <Row>
        <Col span={11}>
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
        <Col span={11} offset={2}>
          <Form.Item
            name="organization"
            label="Organization Name "
            rules={[
              {
                required: true,
                message: "Organization Name can not be blank",
              },
            ]}
          >
            <Input placeholder="Enter Company Name Ex. Amazon" />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px 10px 0px" }}>
        <Col>
          <Checkbox
            name={"isCurrentCompany"}
            checked={isCurrentCompany}
            onChange={onChange}
          >
            Is This A Current Company ?
          </Checkbox>
        </Col>
      </Row>
      <Row>
        <Col span={11}>
          <Form.Item
            name="employmentStart"
            label="Employment Start Date"
            rules={[
              {
                type: "object",
                required: true,
                message: "Start date can not be blank",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select start date"
            />
          </Form.Item>
        </Col>
        <Col span={11} offset={2}>
          {!isCurrentCompany && (
            <Form.Item
              name="employmentEnd"
              label="Employment End Date"
              rules={[
                {
                  type: "object",
                  required: true,
                  message: "End date can not be blank",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select end date"
              />
            </Form.Item>
          )}
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

export default Experience;

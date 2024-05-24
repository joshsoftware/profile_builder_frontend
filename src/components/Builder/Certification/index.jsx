import React, { useContext } from "react";

import { Button, Col, Form, Input, Row, Space, Typography } from "antd";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { ROUTES } from "../../../Constants";
import { post } from "../../../services/axios";
import { ResumeContext } from "../../../utils/ResumeContext";
import style from "../Builder.module.css";

const Certification = () => {
  const [form] = Form.useForm();
  const { initialState, setInitialState } = useContext(ResumeContext);

  const onFinish = (values) => {
    setInitialState({
      ...initialState,
      certifications: { ...initialState.certifications, ...values },
    });

    post(ROUTES.profile, initialState);
    form.resetFields();
  };

  const onReset = () => {
    form.resetFields();
    setInitialState({
      ...initialState,
      certifications: {},
    });
  };

  return (
    <>
      <Space className={style.certificationTitle}>
        <Typography.Text>
          <small className={style.mandetory}>*</small>Add Certifications
        </Typography.Text>
      </Space>
      <Form
        layout="vertical"
        form={form}
        name="cerfication"
        onFinish={onFinish}
      >
        <Form.List label="Add Certifications" name="cerfication">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key}>
                  <Col span={22}>
                    <Form.Item
                      {...restField}
                      name={[name, "first"]}
                      rules={[
                        {
                          required: true,
                          message: "Certifications can not be blank",
                        },
                      ]}
                    >
                      <Input placeholder={`Certificate ${key + 1}`} />
                    </Form.Item>
                  </Col>
                  <Col span={1} offset={1} style={{ marginTop: "5px" }}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Space>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add More
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                  <Button htmlType="button" onClick={onReset}>
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </>
  );
};

export default Certification;

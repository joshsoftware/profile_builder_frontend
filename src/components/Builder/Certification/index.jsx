import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, Row, Space, Tabs } from "antd";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import moment from "moment";
import PropTypes from "prop-types";
import { useCreateCertificateMutation } from "../../../api/certificationApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import { INVALID_ID_ERROR } from "../../../Constants";
import { filterSection, formatCertificationFields } from "../../../helpers";
import { validateId } from "../../../utils/dto/constants";
import { ResumeContext } from "../../../utils/ResumeContext";

const Certification = ({ certificationData }) => {
  Certification.propTypes = {
    certificationData: PropTypes.object.isRequired
  };

  const [createCertificateService] = useCreateCertificateMutation();
  const [form] = Form.useForm();
  const { initialState, setInitialState } = useContext(ResumeContext);
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([
    { label: "Certification 1", children: null, key: "0" }
  ]);
  const newTabIndex = useRef(1);
  const { profile_id } = useParams();
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10
    }
  });

  useEffect(() => {
    if (profile_id && certificationData) {
      setInitialState({ ...initialState, certificationData });

      if (certificationData?.length > 0) {
        const tabs = certificationData?.map((certificate, index) => ({
          label: `Certification ${index + 1}`,
          children: null,
          key: `${index}`
        }));
        setItems(tabs);
        newTabIndex.current = certificationData?.length;
        form.setFieldsValue(
          certificationData.reduce((acc, certificate, index) => {
            acc[`certificate_${index}`] = {
              id: certificate.id,
              name: certificate.name,
              organization_name: certificate.organization_name,
              description: certificate.description,
              issued_date: certificate.issued_date
                ? moment(certificate.issued_date, "MMM-YYYY")
                : null,
              from_date: certificate.from_date
                ? moment(certificate.from_date, "MMM-YYYY")
                : null,
              to_date: certificate.to_date
                ? moment(certificate.to_date, "MMM-YYYY")
                : null
            };
            return acc;
          }, {})
        );
        setActiveKey("0");
      } else {
        setItems([{ label: "Certification 1", children: null, key: "0" }]);
        newTabIndex.current = 1;
        form.setFieldsValue({});
      }
    }
  }, [profile_id, certificationData]);

  const onFinish = async (values) => {
    const filteredCertificates = filterSection(values);
    const certificates = formatCertificationFields(filteredCertificates);

    setInitialState({
      ...initialState,
      certificates
    });

    if (!validateId(profile_id)) {
      toast.error(INVALID_ID_ERROR);
      return;
    }
    try {
      const response = await createCertificateService({
        profile_id: profile_id,
        values: certificates
      });
      if (response.data?.message) {
        toast.success(response.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
    setInitialState({ ...initialState, certificates });
  };

  const onReset = () => {
    form.resetFields();
    setInitialState({ ...initialState, certificates: [] });
  };

  const onChange = (key) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `${newTabIndex.current++}`;
    setItems([
      ...items,
      {
        label: `Certification ${newTabIndex.current}`,
        children: null,
        key: newActiveKey
      }
    ]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }
    setItems(newPanes);
  };

  const onEdit = (targetKey, action) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setItems((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={add}>Add Certification</Button>
      </div>
      <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
        <SortableContext
          items={items.map((i) => i.key)}
          strategy={horizontalListSortingStrategy}
        >
          <Tabs
            hideAdd
            onChange={onChange}
            activeKey={activeKey}
            type="editable-card"
            onEdit={onEdit}
            items={items.map((item, index) => ({
              ...item,
              children: (
                <Form
                  layout="vertical"
                  form={form}
                  name={`certification_${item.key}`}
                  onFinish={onFinish}
                  key={item.key}
                >
                  <Row>
                    <Col span={11}>
                      <Form.Item name={[`certificate_${index}`, "id"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={[`certificate_${index}`, "name"]}
                        label="Certificate Name"
                        rules={[{ required: true, message: "Name required" }]}
                      >
                        <Input placeholder="Enter certificate name" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={[`certificate_${index}`, "organization_name"]}
                        label="Organization Name"
                      >
                        <Input placeholder="Enter organization name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name={[`certificate_${index}`, "description"]}
                    label="Description"
                  >
                    <Input.TextArea
                      placeholder="Please provide a basic overview of the above certificate"
                      showCount
                      maxLength={300}
                    />
                  </Form.Item>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={[`certificate_${index}`, "issued_date"]}
                        label="Certificate Issued Date"
                      >
                        <DatePicker style={{ width: "100%" }} picker="month" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={[`certificate_${index}`, "from_date"]}
                        label="Certification Start Date"
                      >
                        <DatePicker style={{ width: "100%" }} picker="month" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={[`certificate_${index}`, "to_date"]}
                        label="Certification End Date"
                      >
                        <DatePicker style={{ width: "100%" }} picker="month" />
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
              )
            }))}
            renderTabBar={(tabBarProps, DefaultTabBar) => (
              <DefaultTabBar {...tabBarProps}>
                {(node) => (
                  <DraggableTabNode {...node.props} key={node.key}>
                    {node}
                  </DraggableTabNode>
                )}
              </DefaultTabBar>
            )}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Certification;

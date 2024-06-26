import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, Row, Space, Tabs } from "antd";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import moment from "moment";
import { useGetCertificatesQuery } from "../../../api/certificateApi";
import { DraggableTabNode } from "../../../Constants";
import { post } from "../../../services/axios";
import { ResumeContext } from "../../../utils/ResumeContext";

const Certification = () => {
  const { initialState, setInitialState } = useContext(ResumeContext);
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([{ label: "Certification 1", children: null, key: "0" }]);
  const newTabIndex = useRef(1);
  const { id } = useParams();
  const { data } = useGetCertificatesQuery(id);
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  useEffect(() => {
    if (id && data) {
      setInitialState({ ...initialState, data });

      if (data.length > 0) {
        const tabs = data.map((certificate, index) => ({
          label: `Certification ${index + 1}`,
          children: null,
          key: `${index}`,
        }));
        setItems(tabs);
        newTabIndex.current = data.length;
        form.setFieldsValue(
          data.reduce((acc, certificate, index) => {
            acc[`certificate_${index}`] = {
              name: certificate.name,
              organization_name: certificate.organization_name,
              description: certificate.description,
              issued_date: certificate.issued_date ? moment(certificate.issued_date, "MMM-YYYY") : null,
              from_date: certificate.from_date ? moment(certificate.from_date, "MMM-YYYY") : null,
              to_date: certificate.to_date ? moment(certificate.to_date, "MMM-YYYY") : null,
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
  }, [id, data]);

  const onFinish = (values) => {
    const certificates = items.map((item, index) => ({
      name: values[`certificate_${index}`]?.name,
      organization_name: values[`certificate_${index}`]?.organization_name,
      description: values[`certificate_${index}`]?.description,
      issued_date: values[`certificate_${index}`]?.issued_date?.format("MMM-YYYY"),
      from_date: values[`certificate_${index}`]?.from_date?.format("MMM-YYYY"),
      to_date: values[`certificate_${index}`]?.to_date?.format("MMM-YYYY"),
    }));

    setInitialState({ ...initialState, certificates });

    post(`/api/profiles/${id}/certificates`, { certificates });
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
    setItems([...items, { label: `Certification ${newTabIndex.current}`, children: null, key: newActiveKey }]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
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
        <SortableContext items={items.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
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
                      <Button type="primary" htmlType="submit">Save</Button>
                      <Button htmlType="button" onClick={onReset}>Reset</Button>
                    </Space>
                  </Form.Item>
                </Form>
              ),
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
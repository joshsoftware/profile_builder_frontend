import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, Row, Space, Tabs } from "antd";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import moment from "moment";
import { get, post } from "../../../services/axios";
import { ResumeContext } from "../../../utils/ResumeContext";

const DraggableTabNode = ({ ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props["data-node-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
  };
  return React.cloneElement(props.children, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
};

const Certification = () => {
  const [form] = Form.useForm();
  const { initialState, setInitialState } = useContext(ResumeContext);
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([{ label: "Certification 1", children: null, key: "0" }]);
  const newTabIndex = useRef(1);
  const { id } = useParams();
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  useEffect(() => {
    if (id) {
      get(`/api/profiles/${id}/certificates`)
        .then(response => {
          const certificates = response.data.certificates || [];
          setInitialState({ ...initialState, certificates });

          if (certificates.length > 0) {
            const tabs = certificates.map((certificate, index) => ({
              label: `Certification ${index + 1}`,
              children: null,
              key: `${index}`,
            }));
            setItems(tabs);
            newTabIndex.current = certificates.length;
            form.setFieldsValue(
              certificates.reduce((acc, certificate, index) => {
                acc[`name_${index}`] = certificate.name;
                acc[`organization_name_${index}`] = certificate.organization_name;
                acc[`description_${index}`] = certificate.description;
                acc[`issued_date_${index}`] = certificate.issued_date ? moment(certificate.issued_date, "MMM-YYYY") : null;
                acc[`from_date_${index}`] = certificate.from_date ? moment(certificate.from_date, "MMM-YYYY") : null;
                acc[`to_date_${index}`] = certificate.to_date ? moment(certificate.to_date, "MMM-YYYY") : null;
                return acc;
              }, {})
            );
            setActiveKey("0");
          } else {
            setItems([{ label: "Certification 1", children: null, key: "0" }]);
            newTabIndex.current = 1;
            form.setFieldsValue({});
          }
        })
        .catch(() => {
          setItems([{ label: "Certification 1", children: null, key: "0" }]);
          newTabIndex.current = 1;
          form.setFieldsValue({});
        });
    }
  }, [id]);

  const onFinish = (values) => {
    const certificates = items.map((item, index) => ({
      name: values[`name_${index}`],
      organization_name: values[`organization_name_${index}`],
      description: values[`description_${index}`],
      issued_date: values[`issued_date_${index}`]?.format("MMM-YYYY"),
      from_date: values[`from_date_${index}`]?.format("MMM-YYYY"),
      to_date: values[`to_date_${index}`]?.format("MMM-YYYY"),
    }));

    setInitialState({
      ...initialState,
      certificates,
    });
    console.log({ certificates });

    post(`/api/profiles/${id}/certificates`, { certificates })
    // form.resetFields();
  };

  const onReset = () => {
    form.resetFields();
    setInitialState({
      ...initialState,
      certificates: [],
    });
  };

  const onChange = (key) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `${newTabIndex.current++}`;
    setItems([
      ...items,
      { label: `Certification ${newTabIndex.current}`, children: null, key: newActiveKey },
    ]);
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
                        name={`name_${index}`}
                        label="Certificate Name"
                        rules={[
                          {
                            required: true,
                            message: "Name required",
                          },
                        ]}
                      >
                        <Input placeholder="Enter certificate name" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={`organization_name_${index}`}
                        label="Organization Name"
                      >
                        <Input placeholder="Enter organization name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name={`description_${index}`}
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
                        name={`issued_date_${index}`}
                        label="Certificate Issued Date"
                      >
                        <DatePicker style={{ width: "100%" }} picker="month" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={`from_date_${index}`}
                        label="Certification Start Date"
                      >
                        <DatePicker style={{ width: "100%" }} picker="month" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={`to_date_${index}`}
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

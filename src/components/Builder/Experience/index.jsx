import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, Space, Tabs } from "antd";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import moment from "moment";
import { DESIGNATION } from "../../../Constants";
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

const Experience = () => {
  const { initialState, setInitialState } = useContext(ResumeContext);
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([]);
  const newTabIndex = useRef(1);
  const { id } = useParams();
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  useEffect(() => {
    if (id) {
      get(`/api/profiles/${id}/experiences`)
        .then(response => {
          const experiences = response.data.experiences || [];
          setInitialState({ ...initialState, experiences });

          if (experiences.length > 0) {
            const tabs = experiences.map((experience, index) => ({
              label: `Experience ${index + 1}`,
              children: null,
              key: `${index}`,
            }));
            setItems(tabs);
            newTabIndex.current = experiences.length;
            form.setFieldsValue(
              experiences.reduce((acc, experience, index) => {
                acc[`experience_${index}`] = {
                  ...experience,
                  employmentStart: experience.from_date ? moment(experience.from_date, "MMM-YYYY") : null,
                  employmentEnd: experience.to_date && experience.to_date !== "Present" ? moment(experience.to_date, "MMM-YYYY") : null,
                  isCurrentCompany: experience.to_date === "Present"
                };
                return acc;
              }, {})
            );
            setActiveKey("0");
          } else {
            setItems([{ label: "Experience 1", children: null, key: "0" }]);
            newTabIndex.current = 1;
            form.setFieldsValue({});
          }
        })
        .catch(() => {
          setItems([{ label: "Experience 1", children: null, key: "0" }]);
          newTabIndex.current = 1;
          form.setFieldsValue({});
        });
    }
  }, [id]);

  const onFinish = (values) => {
    const experiences = items.map((item, index) => {
      return {
        designation: values[`experience_${index}`]?.designation,
        company_name: values[`experience_${index}`]?.company_name,
        from_date: values[`experience_${index}`]?.employmentStart?.format("MMM-YYYY"),
        to_date: values[`experience_${index}`]?.isCurrentCompany
          ? "Present"
          : values[`experience_${index}`]?.employmentEnd?.format("MMM-YYYY"),
      };
    });

    setInitialState({
      ...initialState,
      experiences,
    });

    post(`/api/profiles/${id}/experiences`, { experiences })
    //form.resetFields();
  };

  const onReset = () => {
    form.resetFields();
    setInitialState({
      ...initialState,
      experiences: [],
    });
  };

  const onChangeCheckbox = (e, key) => {
    const checked = e.target.checked;
    setItems(items.map((item) => {
      if (item.key === key) {
        return { ...item, isCurrentCompany: checked };
      }
      return item;
    }));
  };

  const onChange = (key) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `${newTabIndex.current++}`;
    setItems([
      ...items,
      { label: `Experience ${newTabIndex.current}`, children: null, key: newActiveKey },
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
        <Button onClick={add}>Add Experience</Button>
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
                  name={`experience_${item.key}`}
                  onFinish={onFinish}
                  key={item.key}
                >
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={[`experience_${index}`, "designation"]}
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
                        name={[`experience_${index}`, "company_name"]}
                        label="Company Name"
                      >
                        <Input placeholder="Enter Company Name eg. Amazon" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ margin: "10px 0px 10px 0px" }}>
                    <Col>
                      <Form.Item name={[`experience_${index}`, "isCurrentCompany"]} valuePropName="checked" initialValue={false}>
                        <Checkbox
                          onChange={(e) => onChangeCheckbox(e, item.key)}
                        >
                          Is This A Current Company?
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={[`experience_${index}`, "employmentStart"]}
                        label="Employment Start Date"
                        rules={[
                          {
                            type: "object",
                            required: true,
                            message: "Start date can not be blank",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} picker="month"/>
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      {!item.isCurrentCompany && (
                        <Form.Item
                          name={[`experience_${index}`, "employmentEnd"]}
                          label="Employment End Date"
                          rules={[
                            {
                              type: "object",
                              required: true,
                              message: "End date can not be blank",
                            },
                          ]}
                        >
                          <DatePicker style={{ width: "100%" }} picker="month"/>
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

export default Experience;

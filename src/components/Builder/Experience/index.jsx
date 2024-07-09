import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
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
  Tabs
} from "antd";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import moment from "moment";
import PropTypes from "prop-types";
import { useCreateExperienceMutation } from "../../../api/experienceApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import { DESIGNATION, INVALID_ID_ERROR } from "../../../Constants";
import { filterSection, formatExperienceFields } from "../../../helpers";
import { validateId } from "../../../utils/dto/constants";
import { ResumeContext } from "../../../utils/ResumeContext";

const Experience = ({ experienceData }) => {
  Experience.propTypes = {
    experienceData: PropTypes.object
  };
  const [createExperienceService] = useCreateExperienceMutation();
  const { initialState, setInitialState } = useContext(ResumeContext);
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([
    { label: "Experience 1", children: null, key: "0" }
  ]);
  const newTabIndex = useRef(1);
  const { profile_id } = useParams();
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10
    }
  });

  useEffect(() => {
    if (profile_id && experienceData) {
      setInitialState({ ...initialState, experienceData });

      if (experienceData?.length > 0) {
        const tabs = experienceData?.map((experience, index) => ({
          label: `Experience ${index + 1}`,
          children: null,
          key: `${index}`
        }));
        setItems(tabs);
        newTabIndex.current = experienceData?.length;
        form.setFieldsValue(
          experienceData.reduce((acc, experience, index) => {
            acc[`experience_${index}`] = {
              ...experience,
              id: experience?.id,
              employmentStart: experience.from_date
                ? moment(experience.from_date, "MMM-YYYY")
                : null,
              employmentEnd:
                experience.to_date && experience.to_date !== "Present"
                  ? moment(experience.to_date, "MMM-YYYY")
                  : null,
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
    }
  }, [profile_id, experienceData]);

  const onFinish = async (values) => {
    const filteredExperiences = filterSection(values);
    const experiences = formatExperienceFields(filteredExperiences);

    setInitialState({
      ...initialState,
      experiences
    });

    if (!validateId(profile_id)) {
      toast.error(INVALID_ID_ERROR);
      return;
    }

    try {
      const response = await createExperienceService({
        profile_id: profile_id,
        values: experiences
      });
      if (response.data?.message) {
        toast.success(response.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  const onReset = () => {
    form.resetFields();
    setInitialState({
      ...initialState,
      experiences: []
    });
  };

  const onChangeCheckbox = (e, key) => {
    const checked = e.target.checked;
    setItems(
      items.map((item) => {
        if (item.key === key) {
          return { ...item, isCurrentCompany: checked };
        }
        return item;
      })
    );
  };

  const onChange = (key) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `${newTabIndex.current++}`;
    setItems([
      ...items,
      {
        label: `Experience ${newTabIndex.current}`,
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
    <>
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button onClick={add}>Add Experience</Button>
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
                    name={`experience_${item.key}`}
                    onFinish={onFinish}
                    key={item.key}
                  >
                    <Row>
                      <Col span={11}>
                        <Form.Item name={[`experience_${index}`, "id"]} hidden>
                          <Input />
                        </Form.Item>{" "}
                        <Form.Item
                          name={[`experience_${index}`, "designation"]}
                          label="Designation"
                          rules={[
                            {
                              required: true,
                              message: "Designation can not be blank"
                            }
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
                        <Form.Item
                          name={[`experience_${index}`, "isCurrentCompany"]}
                          valuePropName="checked"
                          initialValue={false}
                        >
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
                              message: "End date can not be blank"
                            }
                          ]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            picker="month"
                          />
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
                                message: "End date can not be blank"
                              }
                            ]}
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              picker="month"
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
    </>
  );
};

export default Experience;

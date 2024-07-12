import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tabs,
} from "antd";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import moment from "moment";
import PropTypes from "prop-types";
import {
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useUpdateExperienceMutation,
} from "../../../api/experienceApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import Modals from "../../../common-components/Modals";
import {
  DESIGNATION,
  INVALID_ID_ERROR,
  SUCCESS_TOASTER,
} from "../../../Constants";
import { filterSection, validateId } from "../../../helpers";

const Experience = ({ experienceData }) => {
  const [action, setAction] = useState("create");
  const [createExperienceService] = useCreateExperienceMutation();
  const [updateExperienceService] = useUpdateExperienceMutation();
  const [deleteExperienceService] = useDeleteExperienceMutation();
  const [modalState, setModalState] = useState({ isVisible: false, key: null });
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([
    {
      label: "Experience 1",
      children: null,
      key: "0",
      isExisting: false,
    },
  ]);
  const newTabIndex = useRef(1);
  const { profile_id } = useParams();
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  useEffect(() => {
    if (profile_id && experienceData) {
      if (experienceData?.length > 0) {
        const tabs = experienceData.map((experience, index) => ({
          label: `Experience ${index + 1}`,
          children: null,
          key: `${index}`,
          isExisting: experience.isExisting,
        }));

        setItems(tabs);
        newTabIndex.current = experienceData.length;
        form.setFieldsValue(
          experienceData.reduce((acc, experience, index) => {
            acc[`experience_${index}`] = {
              ...experience,
              id: experience?.id,
              from_date: experience.from_date
                ? moment(experience.from_date)
                : null,
              to_date: experience.to_date ? moment(experience.to_date) : null,
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

  const handleCreate = async (values) => {
    try {
      const response = await createExperienceService({
        profile_id: profile_id,
        values: values,
      });
      if (response.data?.message) {
        toast.success(response.data?.message, SUCCESS_TOASTER);
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  const handleUpdate = async (values) => {
    try {
      for (const experience of values) {
        if (experience?.id) {
          const response = await updateExperienceService({
            profile_id: profile_id,
            experience_id: experience.id,
            values: experience,
          });
          if (response.data?.message) {
            toast.success(response.data?.message, SUCCESS_TOASTER);
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  const onFinish = (values) => {
    const filteredExperiences = filterSection(values);
    const experiences = formatExperienceFields(filteredExperiences);

    if (!validateId(profile_id)) {
      toast.error(INVALID_ID_ERROR);
      return;
    }

    if (action === "create") {
      handleCreate(experiences);
    } else if (action === "update") {
      const activeExperienceKey = `experience_${activeKey}`;
      const activeExperience = values[activeExperienceKey];
      handleUpdate([activeExperience]);
    }
  };

  const onReset = () => {
    form.resetFields();
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
        key: newActiveKey,
      },
    ]);
    setActiveKey(newActiveKey);
    form.resetFields([`experience_${newActiveKey}`]);
  };

  const showModal = (key) => {
    setModalState({ isVisible: true, key });
  };

  const handleCancel = () => {
    setModalState({ isVisible: false, key: null });
  };

  const remove = async () => {
    const targetIndex = items.findIndex((pane) => pane.key === modalState.key);
    const newPanes = items.filter((pane) => pane.key !== modalState.key);
    try {
      if (experienceData[modalState.key]?.id) {
        const response = await deleteExperienceService({
          profile_id: profile_id,
          experience_id: experienceData[modalState.key]?.id,
        });

        if (response?.data) {
          toast.success(response?.data, SUCCESS_TOASTER);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
    form.resetFields([`experience_${modalState.key}`]);
    if (newPanes.length && modalState.key === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }
    setItems(newPanes);
    setModalState({ isVisible: false, key: null });
  };

  const onEdit = (targetKey, action) => {
    if (action === "add") {
      add();
    } else {
      showModal(targetKey);
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

  const formatExperienceFields = (experiences) => {
    return Object.keys(experiences).map((key) => {
      const experience = experiences[key];
      return {
        ...experience,
        from_date: experience.from_date
          ? experience.from_date.format("YYYY-MM-DD")
          : null,
        to_date: experience.to_date
          ? experience.to_date.format("YYYY-MM-DD")
          : null,
      };
    });
  };

  return (
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
                      </Form.Item>
                      <Form.Item
                        name={[`experience_${index}`, "designation"]}
                        label="Designation"
                        rules={[
                          {
                            required: true,
                            message: "Designation is required",
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
                    <Col span={11}>
                      <Form.Item
                        name={[`experience_${index}`, "from_date"]}
                        label="Employment Start Date"
                        rules={[
                          {
                            required: true,
                            message: "Start date is required",
                          },
                          {
                            validator: (_, value) =>
                              value && value > moment()
                                ? Promise.reject(
                                    new Error(
                                      "Start date cannot be in the future"
                                    )
                                  )
                                : Promise.resolve(),
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} picker="month" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={[`experience_${index}`, "to_date"]}
                        label="Employment End Date"
                        rules={[
                          {
                            type: "object",
                            required: true,
                            message: "End date is required",
                          },
                          {
                            validator: (_, value) =>
                              value && value > moment()
                                ? Promise.reject(
                                    new Error(
                                      "End date cannot be in the future"
                                    )
                                  )
                                : Promise.resolve(),
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} picker="month" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => setAction("create")}
                        disabled={item.isExisting}
                      >
                        Create Experiences
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => setAction("update")}
                        disabled={items.length === 0 || !item.isExisting}
                      >
                        Update Experience {Number(item.key) + 1}
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
      <Modals
        isVisible={modalState.isVisible}
        onOk={remove}
        onCancel={handleCancel}
      />
    </div>
  );
};

Experience.propTypes = {
  experienceData: PropTypes.array,
};

export default Experience;

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
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
  Spin,
  Tabs,
} from "antd";
import { DragOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import {
  experienceApi,
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useUpdateExperienceMutation,
} from "../../../api/experienceApi";
import { useUpdateSequenceMutation } from "../../../api/profileApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import {
  DELETING_SPIN,
  DESIGNATION,
  INVALID_ID_ERROR,
  PRESENT_VALUE,
  SPIN_SIZE,
  SUCCESS_TOASTER,
} from "../../../Constants";
import {
  filterSection,
  formatExperienceFields,
  showConfirm,
  validateId,
} from "../../../helpers";
import styles from "../Builder.module.css";

const Experience = ({ experienceData }) => {
  const [action, setAction] = useState("create");
  const [createExperienceService, { isLoading: isCreating }] =
    useCreateExperienceMutation();
  const [updateExperienceService, { isLoading: isUpdating }] =
    useUpdateExperienceMutation();
  const [deleteExperienceService, { isLoading: isDeleting }] =
    useDeleteExperienceMutation();
  const [updateSequence, { isLoading: isSequenceUpdating }] =
    useUpdateSequenceMutation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("0");
  const [isCurrentCompany, setIsCurrentCompany] = useState({});
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
  const [dragged, setDragged] = useState(false);
  const [newOrder, setNewOrder] = useState({});
  const [formChange, setFormChange] = useState(false);
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
          id: experience.id,
        }));

        setItems(tabs);
        newTabIndex.current = experienceData.length;
        form.setFieldsValue(
          experienceData.reduce((acc, experience, key) => {
            const isCurrent = experience.to_date === PRESENT_VALUE;

            acc[`experience_${key}`] = {
              ...experience,
              id: experience?.id,
              from_date: experience.from_date
                ? dayjs(experience.from_date)
                : null,
              to_date:
                experience.to_date && experience.to_date !== PRESENT_VALUE
                  ? dayjs(experience.to_date)
                  : "",
            };
            setIsCurrentCompany((prevState) => ({
              ...prevState,
              [key]: isCurrent,
            }));
            return acc;
          }, {}),
        );
        setActiveKey("0");
      } else {
        setItems([{ label: "Experience 1", children: null, key: "0" }]);
        newTabIndex.current = 1;
        form.setFieldsValue({});
      }
    }
  }, [profile_id, experienceData, form]);

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
    if (formChange) {
      try {
        for (const experience of values) {
          if (experience?.id) {
            const response = await updateExperienceService({
              profile_id: profile_id,
              experience_id: experience.id,
              values: {
                ...experience,
                from_date: experience.from_date.format("MMM-YYYY"),
                to_date: isCurrentCompany[activeKey]
                  ? PRESENT_VALUE
                  : experience.to_date.format("MMM-YYYY"),
              },
            });
            if (response.data?.message) {
              toast.success(response.data?.message, SUCCESS_TOASTER);
              setFormChange(false);
            }
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.error_message);
      }
    } else {
      toast.success("No new changes detected.");
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

  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    showConfirm({
      onOk: async () => {
        try {
          if (experienceData[targetKey]?.id) {
            const response = await deleteExperienceService({
              profile_id: profile_id,
              experience_id: experienceData[targetKey]?.id,
            });

            if (response?.data) {
              toast.success(response?.data, SUCCESS_TOASTER);
            }
          }
        } catch (error) {
          toast.error(error.response?.data?.error_message);
        }
        form.resetFields([`experience_${targetKey}`]);
        if (newPanes.length && targetKey === activeKey) {
          const { key } =
            newPanes[
              targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
            ];
          setActiveKey(key);
        }
        setItems(newPanes);
        newTabIndex.current--;
      },
      onCancel: () => {},
      message: "Are you sure you want to delete this experience?",
    });
  };

  const onEdit = (targetKey, action) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  const handleIsCurrentCompany = (key) => {
    setIsCurrentCompany((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setItems((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        const newItems = arrayMove(prev, activeIndex, overIndex);
        const newOrder = {};
        newItems.forEach((item, index) => {
          newOrder[String(item.id)] = index + 1;
        });
        setDragged(true);
        setNewOrder(newOrder);
        return newItems;
      });
    }
  };

  const handleUpdateOrder = async () => {
    const payload = {
      id: Number(profile_id),
      component: {
        comp_name: "experiences",
        component_priorities: newOrder,
      },
    };
    try {
      const response = await updateSequence(payload);
      if (response) {
        dispatch(experienceApi.util.invalidateTags(["experience"]));
        toast.success(response.data, SUCCESS_TOASTER);
        setDragged(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  const handleExperiences = (action) => {
    form
      .validateFields()
      .then(() => {
        setAction(action);
        form.submit();
      })
      .catch((errorInfo) => {
        const errorFields = errorInfo.errorFields;
        if (errorFields.length > 0) {
          const firstErrorField = errorFields[0].name[0];
          const keyWithError = firstErrorField.split("_")[1];
          setActiveKey(keyWithError);
        }
      });
  };

  return (
    <Spin
      tip={DELETING_SPIN}
      size={SPIN_SIZE}
      spinning={isDeleting}
      className={styles.spin}
    >
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
                icon: <DragOutlined />,
                children: (
                  <Form
                    layout="vertical"
                    form={form}
                    name={`experience_${item.key}`}
                    onFinish={onFinish}
                    onValuesChange={() => setFormChange(true)}
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
                          <Input placeholder="Software Engineer, etc." />
                        </Form.Item>
                      </Col>
                      <Col span={11} offset={2}>
                        <Form.Item
                          name={[`experience_${index}`, "company_name"]}
                          label="Company Name"
                          rules={[
                            {
                              required: true,
                              message: "Company Name required",
                            },
                          ]}
                        >
                          <Input placeholder="Enter Company Name eg. Amazon" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row style={{ margin: "10px 0px 10px 0px" }}>
                      <Col>
                        <Form.Item
                          name={[`experience_${index}`, "isCurrentCompany"]}
                        >
                          <Checkbox
                            onChange={() => handleIsCurrentCompany(item.key)}
                            checked={isCurrentCompany[item.key]}
                          >
                            Is This A Current Company?
                          </Checkbox>
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
                                value && value > dayjs()
                                  ? Promise.reject(
                                      new Error(
                                        "Start date cannot be in the future",
                                      ),
                                    )
                                  : Promise.resolve(),
                            },
                          ]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            picker="month"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={11} offset={2}>
                        {!isCurrentCompany[item.key] && (
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
                                  value && value > dayjs()
                                    ? Promise.reject(
                                        new Error(
                                          "End date cannot be in the future",
                                        ),
                                      )
                                    : Promise.resolve(),
                              },
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
                        <Button
                          type="primary"
                          htmlType="button"
                          onClick={() => handleExperiences("create")}
                          disabled={item.isExisting}
                          loading={isCreating}
                        >
                          Create Experiences
                        </Button>
                        <Button
                          type="primary"
                          htmlType="button"
                          onClick={() => handleExperiences("update")}
                          disabled={items.length === 0 || !item.isExisting}
                          loading={isUpdating}
                        >
                          Update Experience {Number(item.key) + 1}
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                          Reset
                        </Button>
                        <Button
                          type="primary"
                          onClick={handleUpdateOrder}
                          disabled={!dragged}
                          loading={isSequenceUpdating}
                        >
                          Update Order
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
    </Spin>
  );
};

Experience.propTypes = {
  experienceData: PropTypes.array,
};

export default Experience;

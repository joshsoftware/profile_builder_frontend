import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Col, Form, Input, Row, Space, Tabs } from "antd";
import { DragOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import PropTypes from "prop-types";
import {
  educationApi,
  useCreateEducationMutation,
  useDeleteEducationMutation,
  useUpdateEducationMutation,
} from "../../../api/educationApi";
import { useUpdateSequenceMutation } from "../../../api/profileApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import { INVALID_ID_ERROR, SUCCESS_TOASTER } from "../../../Constants";
import {
  filterSection,
  formatEducationFields,
  showConfirm,
  validateId,
} from "../../../helpers";

const Education = ({ educationData }) => {
  const [action, setAction] = useState("create");
  const [createEducationService] = useCreateEducationMutation();
  const [updateEducationService] = useUpdateEducationMutation();
  const [deleteEducationService] = useDeleteEducationMutation();
  const [updateSequence] = useUpdateSequenceMutation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([
    {
      label: "Education 1",
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
    activationConstraint: {
      distance: 10,
    },
  });

  useEffect(() => {
    if (profile_id && educationData) {
      if (educationData?.length > 0) {
        const tabs = educationData.map((education, index) => ({
          label: `Education ${index + 1}`,
          children: null,
          key: `${index}`,
          isExisting: education.isExisting,
          id: education.id,
        }));
        setItems(tabs);
        newTabIndex.current = educationData.length;
        form.setFieldsValue(
          educationData.reduce((acc, education, index) => {
            acc[`education_${index}`] = {
              ...education,
              id: education?.id,
            };
            return acc;
          }, {}),
        );
        setActiveKey("0");
      } else {
        setItems([{ label: "Education 1", children: null, key: "0" }]);
        newTabIndex.current = 1;
        form.setFieldsValue({});
      }
    }
  }, [profile_id, educationData, form]);

  const handleCreate = async (values) => {
    try {
      const response = await createEducationService({
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
        for (const education of values) {
          if (education.id) {
            const response = await updateEducationService({
              profile_id: profile_id,
              education_id: education.id,
              values: education,
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
    const filteredEducation = filterSection(values);
    const educations = formatEducationFields(filteredEducation);

    if (!validateId(profile_id)) {
      toast.error(INVALID_ID_ERROR);
      return;
    }

    if (action === "create") {
      handleCreate(educations);
    } else if (action === "update") {
      const activeEducationKey = `education_${activeKey}`;
      const activeEducation = values[activeEducationKey];
      handleUpdate([activeEducation]);
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
        label: `Education ${newTabIndex.current}`,
        children: null,
        key: newActiveKey,
      },
    ]);
    form.resetFields([`education_${newActiveKey}`]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    showConfirm({
      onOk: async () => {
        try {
          if (educationData[targetKey]?.id) {
            const response = await deleteEducationService({
              profile_id: profile_id,
              education_id: educationData[targetKey]?.id,
            });

            if (response?.data) {
              toast.success(response?.data, SUCCESS_TOASTER);
            }
          }
        } catch (error) {
          toast.error(error.response?.data?.error_message);
        }
        form.resetFields([`education_${targetKey}`]);
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
      message: "Are you sure you want to delete this education?",
    });
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
        comp_name: "educations",
        component_priorities: newOrder,
      },
    };
    try {
      const response = await updateSequence(payload);
      if (response) {
        dispatch(educationApi.util.invalidateTags(["education"]));
        toast.success(response.data, SUCCESS_TOASTER);
        setDragged(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  const handleEducations = (action) => {
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
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={add}>Add Education</Button>
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
                  name={`education_${item.key}`}
                  onFinish={onFinish}
                  onValuesChange={() => setFormChange(true)}
                  key={item.key}
                >
                  <Form.Item name={[`education_${index}`, "id"]} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[`education_${index}`, "degree"]}
                    label="Degree"
                    rules={[
                      {
                        required: true,
                        message: "Degree required",
                      },
                    ]}
                  >
                    <Input placeholder="Eg. MCS, BTech in CS" />
                  </Form.Item>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={[`education_${index}`, "university_name"]}
                        label="University/College Name"
                      >
                        <Input placeholder="Eg. Savitribai Phule Pune University" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={[`education_${index}`, "place"]}
                        label="Place"
                      >
                        <Input placeholder="Eg. Pune" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={[`education_${index}`, "percent_or_cgpa"]}
                        label="CGPA/Percentage (%)"
                      >
                        <Input placeholder="9.2 or 92%" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={[`education_${index}`, "passing_year"]}
                        label="Passout Year"
                      >
                        <Input placeholder="2024" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="button"
                        onClick={() => handleEducations("create")}
                        disabled={item.isExisting}
                      >
                        Create Educations
                      </Button>
                      <Button
                        type="primary"
                        htmlType="button"
                        onClick={() => handleEducations("update")}
                        disabled={items.length === 0 || !item.isExisting}
                      >
                        Update Education {Number(item.key) + 1}
                      </Button>
                      <Button htmlType="button" onClick={onReset}>
                        Reset
                      </Button>
                      <Button
                        type="primary"
                        onClick={handleUpdateOrder}
                        disabled={!dragged}
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
  );
};

Education.propTypes = {
  educationData: PropTypes.array,
};

export default Education;

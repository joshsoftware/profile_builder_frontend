import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Form, Input, Space, Spin, Tabs } from "antd";
import { DragOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import PropTypes from "prop-types";
import {
  achievementApi,
  useCreateAchievementMutation,
  useDeleteAchievementMutation,
  useUpdateAchievementMutation,
} from "../../../api/achievementApi";
import { useUpdateSequenceMutation } from "../../../api/profileApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import {
  DELETING_SPIN,
  INVALID_ID_ERROR,
  SPIN_SIZE,
  SUCCESS_TOASTER,
} from "../../../Constants";
import {
  filterSection,
  formatAchievementFields,
  showConfirm,
  validateId,
} from "../../../helpers";
import styles from "../Builder.module.css";

const Achievement = ({ achievementData }) => {
  const { profile_id } = useParams();
  const [createAchievementService, { isLoading: isCreating }] =
    useCreateAchievementMutation();
  const [updateAchievementService, { isLoading: isUpdating }] =
    useUpdateAchievementMutation();
  const [deleteAchievementService, { isLoading: isDeleting }] =
    useDeleteAchievementMutation();
  const [updateSequence, { isLoading: isSequenceUpdating }] =
    useUpdateSequenceMutation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([
    {
      label: "Achievement 1",
      children: null,
      key: "0",
      isExisting: false,
    },
  ]);
  const newTabIndex = useRef(1);
  const [action, setAction] = useState("create");
  const [dragged, setDragged] = useState(false);
  const [newOrder, setNewOrder] = useState({});
  const [formChange, setFormChange] = useState(false);
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  const resetItems = useCallback(() => {
    setItems([{ label: "Achievement 1", children: null, key: "0" }]);
    newTabIndex.current = 1;
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (profile_id && achievementData) {
      if (achievementData?.length > 0) {
        const tabs = achievementData.map((achievement, index) => ({
          label: `Achievement ${index + 1}`,
          children: null,
          key: `${index}`,
          isExisting: achievement.isExisting,
          id: achievement.id,
        }));
        setItems(tabs);
        newTabIndex.current = achievementData.length;
        form.setFieldsValue(
          achievementData.reduce((acc, achievement, index) => {
            acc[`achievement_${index}`] = {
              ...achievement,
              id: achievement.id,
            };
            return acc;
          }, {}),
        );
        setActiveKey("0");
      } else {
        resetItems();
      }
    }
  }, [profile_id, achievementData, form, resetItems]);

  const handleCreate = async (values) => {
    try {
      const response = await createAchievementService({
        profile_id: profile_id,
        values: values,
      });
      if (response.data?.message) {
        toast.success(response.data?.message, SUCCESS_TOASTER);
        window.location.reload(); // needs tobe remove after implement download popover
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  const handleUpdate = async (values) => {
    if (formChange) {
      try {
        for (const achievement of values) {
          if (achievement.id) {
            const response = await updateAchievementService({
              profile_id: profile_id,
              achievement_id: achievement.id,
              values: achievement,
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
    const filteredAchievements = filterSection(values);
    const achievements = formatAchievementFields(filteredAchievements);

    if (!validateId(profile_id)) {
      toast.error(INVALID_ID_ERROR);
      return;
    }

    if (action === "create") {
      handleCreate(achievements);
    } else if (action === "update") {
      const activeAchievementKey = `achievement_${activeKey}`;
      const activeAchievement = values[activeAchievementKey];
      handleUpdate([activeAchievement]);
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
        label: `Achievement ${newTabIndex.current}`,
        children: null,
        key: newActiveKey,
      },
    ]);
    form.resetFields([`achievement_${newActiveKey}`]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);

    showConfirm({
      onOk: async () => {
        try {
          if (achievementData[targetKey]?.id) {
            const response = await deleteAchievementService({
              profile_id: profile_id,
              achievement_id: achievementData[targetKey]?.id,
            });

            if (response?.data) {
              toast.success(response?.data, SUCCESS_TOASTER);
              window.location.reload(); // needs tobe remove after implement download popover
            }
          }
        } catch (error) {
          toast.error(error.response?.data?.error_message);
        }

        form.resetFields([`achievement_${targetKey}`]);

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
      onCancel() {},
      message: "Are you sure you want to delete this achievement?",
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
        comp_name: "achievements",
        component_priorities: newOrder,
      },
    };
    try {
      const response = await updateSequence(payload);
      if (response) {
        dispatch(achievementApi.util.invalidateTags(["achievement"]));
        toast.success(response.data, SUCCESS_TOASTER);
        setDragged(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  const handleAchievements = (action) => {
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
          <Button onClick={add}>Add Achievement</Button>
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
                    name={`achievement_${item.key}`}
                    onFinish={onFinish}
                    onValuesChange={() => setFormChange(true)}
                    key={item.key}
                  >
                    <Form.Item name={[`achievement_${index}`, "id"]} hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={[`achievement_${index}`, "name"]}
                      label="Achievement Name"
                      rules={[
                        {
                          required: true,
                          message: "Name is required",
                        },
                      ]}
                    >
                      <Input placeholder="Achievement name e.g. Star Performer" />
                    </Form.Item>
                    <Form.Item
                      name={[`achievement_${index}`, "description"]}
                      label="Description"
                    >
                      <Input.TextArea
                        placeholder="Please provide a basic overview of the above achievement"
                        showCount
                        minLength={50}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Space>
                        <Button
                          type="primary"
                          htmlType="button"
                          onClick={() => handleAchievements("create")}
                          disabled={item.isExisting}
                          loading={isCreating}
                        >
                          Create Achievements
                        </Button>
                        <Button
                          type="primary"
                          htmlType="button"
                          onClick={() => handleAchievements("update")}
                          disabled={items.length === 0 || !item.isExisting}
                          loading={isUpdating}
                        >
                          Update Achievement {Number(item.key) + 1}
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

Achievement.propTypes = {
  achievementData: PropTypes.array,
};

export default Achievement;

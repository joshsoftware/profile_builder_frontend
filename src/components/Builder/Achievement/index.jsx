import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Button, Form, Input, Space, Tabs } from "antd";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import PropTypes from "prop-types";
import {
  useCreateAchievementMutation,
  useUpdateAchievementMutation,
} from "../../../api/achievementApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import { INVALID_ID_ERROR } from "../../../Constants";
import { filterSection, formatAchievementFields } from "../../../helpers";
import { validateId } from "../../../utils/dto/constants";
import { ResumeContext } from "../../../utils/ResumeContext";

const Achievement = ({ achievementData }) => {
  Achievement.propTypes = {
    achievementData: PropTypes.object.isRequired,
  };

  const { profile_id } = useParams();
  const [createAchievementService] = useCreateAchievementMutation();
  const [updateAchievementService] = useUpdateAchievementMutation();
  const { initialState, setInitialState } = useContext(ResumeContext);
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([
    {
      label: "Achievement 1",
      children: null,
      key: "0",
      isExisting: "",
    },
  ]);
  const newTabIndex = useRef(1);
  const [action, setAction] = useState("create");
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  useEffect(() => {
    if (profile_id && achievementData) {
      setInitialState({ ...initialState, achievementData });

      if (achievementData?.length > 0) {
        const tabs = achievementData.map((achievement, index) => ({
          label: `Achievement ${index + 1}`,
          children: null,
          key: `${index}`,
          isExisting: achievement.isExisting,
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
          }, {})
        );
        setActiveKey("0");
      } else {
        resetItems();
      }
    }
  }, [profile_id, achievementData]);

  const resetItems = () => {
    setItems([{ label: "Achievement 1", children: null, key: "0" }]);
    newTabIndex.current = 1;
    form.resetFields();
  };

  const handleCreate = async (values) => {
    try {
      const response = await createAchievementService({
        profile_id: profile_id,
        values: values,
      });
      if (response.data?.message) {
        toast.success(response.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  const handleUpdate = async (values) => {
    try {
      for (const achievement of values) {
        if (achievement.id) {
          const response = await updateAchievementService({
            profile_id: profile_id,
            achievement_id: achievement.id,
            values: achievement,
          });
          if (response.data?.message) {
            toast.success(response.data?.message);
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  const onFinish = (values) => {
    const filteredAchievements = filterSection(values);
    const achievements = formatAchievementFields(filteredAchievements);

    setInitialState({
      ...initialState,
      achievements,
    });

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
    setInitialState({
      ...initialState,
      achievements: [],
    });
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
              children: (
                <Form
                  layout="vertical"
                  form={form}
                  name={`achievement_${item.key}`}
                  onFinish={onFinish}
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
                      maxLength={300}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => setAction("create")}
                        disabled={item.isExisting}
                      >
                        Create Achievements
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => setAction("update")}
                        disabled={items.length === 0 || !item.isExisting}
                      >
                        Update Achievement {Number(item.key) + 1}
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

export default Achievement;

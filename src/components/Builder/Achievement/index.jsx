import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Button, Form, Input, Space, Tabs } from "antd";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import PropTypes from "prop-types";
import { useCreateAchievementMutation } from "../../../api/achievementApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import { INVALID_ID_ERROR } from "../../../Constants";
import { filterSection, formatAchievementFields } from "../../../helpers";
import { validateId } from "../../../utils/dto/constants";
import { ResumeContext } from "../../../utils/ResumeContext";

const Achievement = ({ achievementData }) => {
  Achievement.propTypes = {
    achievementData: PropTypes.object
  };
  const { profile_id } = useParams();
  const [createAchievementService] = useCreateAchievementMutation();
  const { initialState, setInitialState } = useContext(ResumeContext);
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([
    { label: "Achievement 1", children: null, key: "0" }
  ]);
  const newTabIndex = useRef(1);

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10
    }
  });

  useEffect(() => {
    if (profile_id && achievementData) {
      setInitialState({ ...initialState, achievementData });
      if (achievementData?.length > 0) {
        const tabs = achievementData?.map((achievement, index) => ({
          label: `Achievement ${index + 1}`,
          children: null,
          key: `${index}`
        }));
        setItems(tabs);
        newTabIndex.current = achievementData?.length;
        form.setFieldsValue(
          achievementData.reduce((acc, achievement, index) => {
            acc[`achievement_${index}`] = {
              id: achievement.id,
              name: achievement.name,
              description: achievement.description
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

  const onFinish = async (values) => {
    const filteredAchievements = filterSection(values);
    const achievements = formatAchievementFields(filteredAchievements);

    setInitialState({ ...initialState, achievements });
    setInitialState({
      ...initialState,
      achievements
    });

    if (!validateId(profile_id)) {
      toast.error(INVALID_ID_ERROR);
      return;
    }

    try {
      const response = await createAchievementService({
        profile_id: profile_id,
        values: achievements
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
      achievements: []
    });
    setInitialState({ ...initialState, achievements: [] });
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
        key: newActiveKey
      }
    ]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey) => {
    const newItems = items.filter((item) => item.key !== targetKey);
    setItems(newItems);
    if (newItems.length && targetKey === activeKey) {
      setActiveKey(newItems[0].key);
    }
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
                    rules={[{ required: true, message: "Name required" }]}
                  >
                    <Input placeholder="Achievement name eg. star performer" />
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

export default Achievement;

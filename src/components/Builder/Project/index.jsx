import React, { useContext, useEffect, useRef, useState } from "react";
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
  Tabs
} from "antd";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import { skipToken } from "@tanstack/react-query";
import moment from "moment";
import {
  useCreateProjectMutation,
  useGetProjectQuery
} from "../../../api/projectApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import { INVALID_ID_ERROR } from "../../../Constants";
import { validateId } from "../../../utils/dto/constants";
import { ResumeContext } from "../../../utils/ResumeContext";

const Project = () => {
  const [createProjectService] = useCreateProjectMutation();
  const { initialState, setInitialState } = useContext(ResumeContext);
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([]);
  const newTabIndex = useRef(1);
  const { profile_id } = useParams();
  const { data } = useGetProjectQuery(profile_id ?? skipToken);

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10
    }
  });

  useEffect(() => {
    if (profile_id) {
      if (data) {
        setInitialState({ ...initialState, data });
      }

      if (data?.length > 0) {
        const tabs = data.map((project, index) => ({
          label: `Project ${index + 1}`,
          children: null,
          key: `${index}`
        }));
        setItems(tabs);
        newTabIndex.current = data.length;
        form.setFieldsValue(
          data.reduce((acc, project, index) => {
            acc[`project_${index}`] = {
              ...project,
              working_start_date: project.working_start_date
                ? moment(project.working_start_date)
                : null,
              working_end_date: project.working_end_date
                ? moment(project.working_end_date, "MMM-YYYY")
                : null
            };
            return acc;
          }, {})
        );
        setActiveKey("0");
      } else {
        setItems([{ label: "Project 1", children: null, key: "0" }]);
        newTabIndex.current = 1;
        form.setFieldsValue({});
      }
    }
  }, [profile_id, data]);

  const onFinish = async (values) => {
    const projects = items.map((item, index) => {
      const project = values[`project_${index}`];

      return {
        name: project.name,
        description: project.description,
        role: project.role,
        responsibilities: project.responsibilities,
        technologies: project.technologies,
        tech_worked_on: project.tech_worked_on,
        working_start_date: project.working_start_date
          ? project.working_start_date.format("MMM-YYYY")
          : null,
        working_end_date: project.working_end_date
          ? project.working_end_date.format("MMM-YYYY")
          : null,
        duration: project.duration
      };
    });

    setInitialState({
      ...initialState,
      projects
    });

    if (!validateId(profile_id)) {
      toast.error(INVALID_ID_ERROR);
      return;
    }

    try {
      const response = await createProjectService({
        profile_id: profile_id,
        values: projects
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
      projects: []
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
        label: `Project ${newTabIndex.current}`,
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
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={add}>Add Project</Button>
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
                  name={`project-form-${item.key}`}
                  onFinish={onFinish}
                  key={item.key}
                >
                  <Form.Item
                    name={[`project_${index}`, "name"]}
                    label="Project Name"
                    rules={[
                      {
                        required: true,
                        message: "Name required"
                      }
                    ]}
                  >
                    <Input placeholder="Enter project name" />
                  </Form.Item>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={[`project_${index}`, "role"]}
                        label="Role"
                      >
                        <Input placeholder="Enter role" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={[`project_${index}`, "duration"]}
                        label="Project Duration (in years)"
                      >
                        <Input type="number" placeholder="Eg. 2, 1.5" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name={[`project_${index}`, "responsibilities"]}
                    label="Responsibilities"
                  >
                    <Input.TextArea
                      placeholder="Please provide responsibilities"
                      showCount
                      maxLength={300}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[`project_${index}`, "description"]}
                    label="Description of Project"
                  >
                    <Input.TextArea
                      placeholder="Please provide a basic overview of the project"
                      showCount
                      maxLength={300}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[`project_${index}`, "technologies"]}
                    label="Technologies"
                  >
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Tags Mode"
                    />
                  </Form.Item>
                  <Form.Item
                    name={[`project_${index}`, "tech_worked_on"]}
                    label="Technology You Worked On"
                    rules={[
                      {
                        required: true,
                        message: "Worked technology is required"
                      }
                    ]}
                  >
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Tags Mode"
                    />
                  </Form.Item>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={[`project_${index}`, "working_start_date"]}
                        label="Project Start Date"
                      >
                        <DatePicker style={{ width: "100%" }} picker="month" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={[`project_${index}`, "working_end_date"]}
                        label="Project End Date"
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

export default Project;

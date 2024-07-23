import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
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
import { DragOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useUpdateSequenceMutation } from "../../../api/profileApi";
import {
  projectApi,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation
} from "../../../api/projectApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import Modals from "../../../common-components/Modals";
import { INVALID_ID_ERROR, SUCCESS_TOASTER } from "../../../Constants";
import {
  filterSection,
  formatProjectsFields,
  validateId
} from "../../../helpers";

const Project = ({ projectData }) => {
  const [action, setAction] = useState("create");
  const [createProjectService] = useCreateProjectMutation();
  const [updateProjectService] = useUpdateProjectMutation();
  const [deleteProjectService] = useDeleteProjectMutation();
  const [updateSequence] = useUpdateSequenceMutation(); // Add this line
  const [modalState, setModalState] = useState({ isVisible: false, key: null });
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([
    {
      label: "Project 1",
      children: null,
      key: "0",
      isExisting: false
    }
  ]);
  const newTabIndex = useRef(1);
  const { profile_id } = useParams();
  const [dragged, setDragged] = useState(false); // Add this line
  const [newOrder, setNewOrder] = useState({}); // Add this line
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10
    }
  });

  useEffect(() => {
    if (profile_id && projectData) {
      if (projectData?.length > 0) {
        const tabs = projectData.map((project, index) => ({
          label: `Project ${index + 1}`,
          children: null,
          key: `${index}`,
          isExisting: project.isExisting,
          id: project.id,
        }));
        setItems(tabs);
        newTabIndex.current = projectData.length;
        form.setFieldsValue(
          projectData.reduce((acc, project, index) => {
            acc[`project_${index}`] = {
              ...project,
              id: project?.id,
              working_start_date: project.working_start_date
                ? dayjs(project.working_start_date)
                : null,
              working_end_date: project.working_end_date
                ? dayjs(project.working_end_date)
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
  }, [profile_id, projectData, form]);

  const handleCreate = async (values) => {
    try {
      const response = await createProjectService({
        profile_id: profile_id,
        values: values
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
      for (const project of values) {
        if (project.id) {
          const response = await updateProjectService({
            profile_id: profile_id,
            project_id: project.id,
            values: project
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

  const onFinish = async (values) => {
    const filteredProjects = filterSection(values);
    const projects = formatProjectsFields(filteredProjects);

    if (!validateId(profile_id)) {
      toast.error(INVALID_ID_ERROR);
      return;
    }

    if (action === "create") {
      handleCreate(projects);
    } else if (action === "update") {
      const activeProjectKey = `project_${activeKey}`;
      const activeProject = values[activeProjectKey];
      handleUpdate([activeProject]);
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
        label: `Project ${newTabIndex.current}`,
        children: null,
        key: newActiveKey
      }
    ]);
    setActiveKey(newActiveKey);
    form.resetFields([`project_${newActiveKey}`]);
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
      if (projectData[modalState.key]?.id) {
        const response = await deleteProjectService({
          profile_id: profile_id,
          project_id: projectData[modalState.key]?.id
        });

        if (response?.data) {
          toast.success(response?.data, SUCCESS_TOASTER);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
    form.resetFields([`project_${modalState.key}`]);

    if (newPanes.length && modalState.key === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }
    setItems(newPanes);
    setModalState({ isVisible: false, key: null });
    newTabIndex.current--;
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
        const newItems = arrayMove(prev, activeIndex, overIndex);
        const newOrder = {};
        newItems.forEach((item, index) => {
          newOrder[String(item.id)] = index + 1;
        });
        console.log("New Order:", newOrder);
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
        comp_name: "projects",
        component_priorities: newOrder,
      },
    };
    try {
      const response = await updateSequence(payload);
      if (response) {
        dispatch(projectApi.util.invalidateTags(["project"]));
        toast.success(response.data, SUCCESS_TOASTER);
        setDragged(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleProjects = (action) => {
    form
      .validateFields()
      .then((values) => {
        setAction(action);
        onFinish(values);
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
              icon: <DragOutlined />,
              children: (
                <Form
                  layout="vertical"
                  form={form}
                  name={`project_${item.key}`}
                  onFinish={onFinish}
                  key={item.key}
                >
                  <Form.Item name={[`project_${index}`, "id"]} hidden>
                    <Input />
                  </Form.Item>
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
                        rules={[
                          {
                            validator: (_, value) =>
                              value <= 30 && value >= 0
                                ? Promise.resolve()
                                : Promise.reject(
                                    "duration must be a positive number and either a whole number up to 30 years."
                                  )
                          }
                        ]}
                      >
                        <Input type="number" placeholder="Eg. 2, 1.5" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name={[`project_${index}`, "responsibilities"]}
                    label="Responsibilities"
                    rules={[
                      {
                        required: true,
                        message: "Responsibilities required"
                      }
                    ]}
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
                    rules={[
                      {
                        required: true,
                        message: "Description required"
                      }
                    ]}
                  >
                    <Input.TextArea
                      placeholder="Please provide a basic overview of the project"
                      showCount
                      minLength={50}
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
                        rules={[
                          {
                            validator: (_, value) =>
                              value && value > dayjs()
                                ? Promise.reject(
                                    new Error(
                                      "Start date cannot be in the future"
                                    )
                                  )
                                : Promise.resolve()
                          }
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} picker="month" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={[`project_${index}`, "working_end_date"]}
                        label="Project End Date"
                        rules={[
                          {
                            validator: (_, value) =>
                              value && value > dayjs()
                                ? Promise.reject(
                                    new Error(
                                      "End date cannot be in the future"
                                    )
                                  )
                                : Promise.resolve()
                          }
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
                        htmlType="button"
                        onClick={()=> handleProjects("create")}
                        disabled={item.isExisting}
                      >
                        Create Projects
                      </Button>
                      <Button
                        type="primary"
                        htmlType="button"
                        onClick={()=> handleProjects("update")}
                        disabled={items.length === 0 || !item.isExisting}
                      >
                        Update Project {Number(item.key) + 1}
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
      <Modals
        isVisible={modalState.isVisible}
        onOk={remove}
        onCancel={handleCancel}
        message="Are you sure you want to delete this project?"
      />
    </div>
  );
};
Project.propTypes = {
  projectData: PropTypes.array
};
export default Project;

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, Row, Space, Tabs } from "antd";
import { DragOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import {
  certificationApi,
  useCreateCertificateMutation,
  useDeleteCertificateMutation,
  useUpdateCertificateMutation
} from "../../../api/certificationApi";
import { useUpdateSequenceMutation } from "../../../api/profileApi";
import { DraggableTabNode } from "../../../common-components/DraggbleTabs";
import Modals from "../../../common-components/Modals";
import { INVALID_ID_ERROR, SUCCESS_TOASTER } from "../../../Constants";
import {
  filterSection,
  formatCertificationFields,
  validateId
} from "../../../helpers";

const Certification = ({ certificationData }) => {
  const [action, setAction] = useState("create");
  const [createCertificateService] = useCreateCertificateMutation();
  const [updateCertificateService] = useUpdateCertificateMutation();
  const [deleteCertificateService] = useDeleteCertificateMutation();
  const [updateSequence] = useUpdateSequenceMutation();
  const [modalState, setModalState] = useState({ isVisible: false, key: null });
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("0");
  const [items, setItems] = useState([
    {
      label: "Certificate 1",
      children: null,
      key: "0",
      isExisting: false
    }
  ]);
  const newTabIndex = useRef(1);
  const { profile_id } = useParams();
  const dispatch = useDispatch();
  const [dragged, setDragged] = useState(false);
  const [newOrder, setNewOrder] = useState({});
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 }
  });

  useEffect(() => {
    if (profile_id && certificationData) {
      if (certificationData?.length > 0) {
        const tabs = certificationData.map((certificate, index) => ({
          label: `Certification ${index + 1}`,
          children: null,
          key: `${index}`,
          isExisting: certificate.isExisting,
          id: certificate.id,
        }));
        setItems(tabs);
        newTabIndex.current = certificationData.length;
        form.setFieldsValue(
          certificationData.reduce((acc, certificate, index) => {
            acc[`certificate_${index}`] = {
              ...certificate,
              id: certificate?.id,
              issued_date: certificate.issued_date
                ? dayjs(certificate.issued_date)
                : null,
              from_date: certificate.from_date
                ? dayjs(certificate.from_date)
                : null,
              to_date: certificate.to_date ? dayjs(certificate.to_date) : null,
            };
            return acc;
          }, {})
        );
        setActiveKey("0");
      } else {
        setItems([{ label: "Certification 1", children: null, key: "0" }]);
        newTabIndex.current = 1;
        form.setFieldsValue({});
      }
    }
  }, [profile_id, certificationData, form]);

  const handleCreate = async (values) => {
    try {
      const response = await createCertificateService({
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
      for (const certificate of values) {
        if (certificate.id) {
          const response = await updateCertificateService({
            profile_id: profile_id,
            certificate_id: certificate.id,
            values: certificate
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
    const filteredCertificates = filterSection(values);
    const certificates = formatCertificationFields(filteredCertificates);

    if (!validateId(profile_id)) {
      toast.error(INVALID_ID_ERROR);
      return;
    }

    if (action === "create") {
      handleCreate(certificates);
    } else if (action === "update") {
      const activeCertificateKey = `certificate_${activeKey}`;
      const activeCertificate = values[activeCertificateKey];
      handleUpdate([activeCertificate]);
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
        label: `Certification ${newTabIndex.current}`,
        children: null,
        key: newActiveKey
      }
    ]);
    form.resetFields([`certificate_${newActiveKey}`]);
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
      if (certificationData[modalState.key]?.id) {
        const response = await deleteCertificateService({
          profile_id: profile_id,
          certificate_id: certificationData[modalState.key]?.id
        });

        if (response?.data) {
          toast.success(response?.data, SUCCESS_TOASTER);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
    form.resetFields([`certificate_${modalState.key}`]);
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
        comp_name: "certificates",
        component_priorities: newOrder,
      },
    };
    try {
      const response = await updateSequence(payload);
      if (response) {
        dispatch(certificationApi.util.invalidateTags(["certificate"]));
        toast.success(response.data, SUCCESS_TOASTER);
        setDragged(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleCertificates = (action) => {
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
        <Button onClick={add}>Add Certification</Button>
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
                  name={`certification_${item.key}`}
                  onFinish={onFinish}
                  key={item.key}
                >
                  <Row>
                    <Col span={11}>
                      <Form.Item name={[`certificate_${index}`, "id"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={[`certificate_${index}`, "name"]}
                        label="Certificate Name"
                        rules={[
                          {
                            required: true,
                            message: "Name is required"
                          }
                        ]}
                      >
                        <Input placeholder="Enter Certificate Name" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        name={[`certificate_${index}`, "organization_name"]}
                        label="Organization Name"
                      >
                        <Input placeholder="Enter Organization Name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name={[`certificate_${index}`, "description"]}
                    label="Description"
                  >
                    <Input.TextArea
                      placeholder="Provide a basic overview of the certificate"
                      showCount
                      minLength={50}
                    />
                  </Form.Item>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={[`certificate_${index}`, "issued_date"]}
                        label="Issued Date"
                        rules={[
                          {
                            required: true,
                            message: "Issued date required"
                          },
                          {
                            validator: (_, value) =>
                              value && value > dayjs()
                                ? Promise.reject(
                                    new Error(
                                      "Issued date cannot be in the future"
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
                        name={[`certificate_${index}`, "from_date"]}
                        label="Start Date"
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
                  </Row>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name={[`certificate_${index}`, "to_date"]}
                        label="End Date"
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
                        onClick={()=> handleCertificates("create")}
                        disabled={item.isExisting}
                      >
                        Create Certificates
                      </Button>
                      <Button
                        type="primary"
                        htmlType="button"
                        onClick={()=> handleCertificates("update")}
                        disabled={items.length === 0 || !item.isExisting}
                      >
                        Update Certificate {Number(item.key) + 1}
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
        message="Are you sure you want to delete this certificate?"
      />
    </div>
  );
};

Certification.propTypes = {
  certificationData: PropTypes.object
};

export default Certification;

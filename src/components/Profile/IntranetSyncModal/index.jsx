import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Input,
  Modal,
  Space,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EditOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useLazyGetIntranetEmployeeQuery } from "../../../api/profileApi";
import { EDITOR_ROUTE } from "../../../Constants";

const { Title, Text, Paragraph } = Typography;

const STEP_SELECT = "select";
const STEP_LOOKUP = "lookup";

const IntranetSyncModal = ({ open, onClose, onManualCreate }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEP_SELECT);
  const [employeeId, setEmployeeId] = useState("");
  const [fetchedEmployee, setFetchedEmployee] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fetchIntranetEmployee, { isFetching }] = useLazyGetIntranetEmployeeQuery();

  const resetState = () => {
    setStep(STEP_SELECT);
    setEmployeeId("");
    setFetchedEmployee(null);
    setErrorMsg("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleManualCreate = () => {
    resetState();
    onManualCreate();
  };

  const handleFetch = async () => {
    if (!employeeId.trim()) {
      setErrorMsg("Please enter an Employee ID.");
      return;
    }
    setErrorMsg("");
    setFetchedEmployee(null);
    try {
      const employee = await fetchIntranetEmployee(employeeId.trim()).unwrap();
      setFetchedEmployee(employee);
    } catch (error) {
      if (error.status === 409) {
        setErrorMsg(
          error.data?.error_message ||
            "Profile already exists for this Employee ID."
        );
      } else if (error.status === 404) {
        setErrorMsg("No employee found with this ID. Please check the ID or create manually.");
      } else {
        setErrorMsg("Could not reach the Intranet service. Please try again or create manually.");
      }
    }
  };

  const handleProceed = () => {
    navigate(EDITOR_ROUTE, { state: { intranetData: fetchedEmployee } });
    handleClose();
  };

  const stepSelectContent = (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      <Paragraph type="secondary" style={{ marginBottom: 8 }}>
        Choose how you&apos;d like to get started
      </Paragraph>
      <Space size={12} style={{ width: "100%", display: "flex" }}>
        <Card
          id="btn-sync-from-intranet"
          hoverable
          onClick={() => setStep(STEP_LOOKUP)}
          style={{
            flex: 1,
            cursor: "pointer",
            borderColor: "#4361ee",
            background: "#f0f3ff",
            textAlign: "center",
          }}
        >
          <SearchOutlined
            style={{ fontSize: 28, color: "#4361ee", marginBottom: 8 }}
          />
          <Title level={5} style={{ margin: "8px 0 4px" }}>
            Sync from Intranet
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Auto-fill form from the employee database
          </Text>
        </Card>

        <Card
          id="btn-create-manually"
          hoverable
          onClick={handleManualCreate}
          style={{ flex: 1, cursor: "pointer", textAlign: "center" }}
        >
          <EditOutlined
            style={{ fontSize: 28, color: "#6b7280", marginBottom: 8 }}
          />
          <Title level={5} style={{ margin: "8px 0 4px" }}>
            Create Manually
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Start with a blank form
          </Text>
        </Card>
      </Space>
    </Space>
  );

  const stepLookupContent = (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          setStep(STEP_SELECT);
          setFetchedEmployee(null);
          setErrorMsg("");
          setEmployeeId("");
        }}
        style={{ padding: 0 }}
      >
        Back
      </Button>

      <div>
        <div style={{ marginBottom: 6 }}>
          <Text strong>Enter Employee ID</Text>
        </div>
        <Input.Search
          id="intranet-employee-id-input"
          placeholder="e.g. 1001 or JIN1001"
          value={employeeId}
          onChange={(e) => {
          setEmployeeId(e.target.value.trim());
          setErrorMsg("");
          setFetchedEmployee(null);
        }}
        onSearch={handleFetch}
        enterButton={
          <Button
            id="btn-fetch-intranet"
            type="primary"
            loading={isFetching}
            disabled={!employeeId.trim()}
          >
            Fetch
          </Button>
        }
        size="large"
        autoFocus
      />
      </div>

      {errorMsg && <Alert message={errorMsg} type="error" showIcon />}

      {fetchedEmployee && !errorMsg && (
        <Alert
          message={
            <Space direction="vertical" size={2}>
              <Space>
                <UserOutlined style={{ color: "#16a34a" }} />
                <Text strong>{fetchedEmployee.name}</Text>
                <Text type="secondary">
                  &nbsp;·&nbsp; {fetchedEmployee.designation} &nbsp;·&nbsp;{" "}
                  {fetchedEmployee.employeeId}
                </Text>
              </Space>
              <Space style={{ marginLeft: 22 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  📚 {fetchedEmployee.projects?.length || 0} project{(fetchedEmployee.projects?.length === 1) ? "" : "s"} &nbsp;·&nbsp; 🎓 {fetchedEmployee.qualification || "Education not specified"}
                </Text>
              </Space>
            </Space>
          }
          type="success"
          showIcon={false}
        />
      )}
    </Space>
  );

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={
        <Space>
          <UserOutlined />
          <span>Create New Employee Profile</span>
        </Space>
      }
      footer={
        step === STEP_LOOKUP
          ? [
              <Button key="cancel" onClick={handleClose}>
                Cancel
              </Button>,
              <Button
                key="proceed"
                id="btn-fill-form"
                type="primary"
                icon={<ArrowRightOutlined />}
                disabled={!fetchedEmployee}
                onClick={handleProceed}
              >
                Fill Form
              </Button>,
            ]
          : null
      }
      width={520}
      destroyOnClose
    >
      {step === STEP_SELECT ? stepSelectContent : stepLookupContent}
    </Modal>
  );
};

IntranetSyncModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onManualCreate: PropTypes.func.isRequired,
};

export default IntranetSyncModal;

import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Radio,
  Row,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  useDeleteProfileMutation,
  useGetProfileListQuery,
  useUpdateProfileStatusMutation,
} from "../../../api/profileApi";
import Modals from "../../../common-components/Modals";
import { EDITOR_PROFILE_ROUTE, EDITOR_ROUTE } from "../../../Constants";
import Navbar from "../../Navbar/navbar";
import styles from "./ListProfiles.module.css";

const ListProfiles = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [activeStatus, setActiveStatus] = useState(true);
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const { data, isFetching } = useGetProfileListQuery();
  const [deleteProfileService] = useDeleteProfileMutation();
  const [updateProfileStatusService] = useUpdateProfileStatusMutation();

  const [isCurrentEmpModalState, setIsCurrentEmpModalState] = useState({
    isVisibleIsCurrentEmployee: false,
    checked: false,
    profileID: null,
    record: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    isVisibleDelete: false,
    profileID: null,
  });

  const [toggleActiveModal, setToggleActiveModal] = useState({
    isVisibleToggleActive: false,
    isActive: false,
    profileID: null,
  });

  const handleDeleteCancel = () => {
    setDeleteModal({
      ...deleteModal,
      isVisibleDelete: false,
    });
  };
  const showActiveInactiveModal = (profile_id, isActive) => {
    setToggleActiveModal({
      isVisibleToggleActive: true,
      isActive,
      profileID: profile_id,
    });
  };

  const handleToggleActiveStatus = async () => {
    const { profileID, isActive } = toggleActiveModal;
    const is_active = isActive ? "NO" : "YES";
    try {
      const response = await updateProfileStatusService({
        profile_id: profileID,
        profile_status: { is_active },
      });
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
    setToggleActiveModal({
      isVisibleToggleActive: false,
      isActive: false,
      profileID: null,
    });
  };

  const handleToggleActiveCancel = () => {
    setToggleActiveModal({
      ...toggleActiveModal,
      isVisibleToggleActive: false,
    });
  };

  const handleToggleCancel = () => {
    setIsCurrentEmpModalState({
      ...isCurrentEmpModalState,
      isVisibleIsCurrentEmployee: false,
      checked: isCurrentEmpModalState.record?.is_current_employee !== "NO",
    });
  };

  const handleToggleEmployeeStatus = async () => {
    const { profileID, checked } = isCurrentEmpModalState;
    const profile_status = {
      is_current_employee: checked ? "YES" : "NO",
    };
    try {
      const response = await updateProfileStatusService({
        profile_id: profileID,
        profile_status,
      });
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }

    setIsCurrentEmpModalState({
      ...isCurrentEmpModalState,
      isVisibleIsCurrentEmployee: false,
      checked: false,
      profileID: null,
      record: null,
    });
  };

  const showIsCurrentEmpModal = (profile_id, checked, record) => {
    setIsCurrentEmpModalState({
      isVisibleIsCurrentEmployee: true,
      checked,
      profileID: profile_id,
      record,
    });
  };
  const showDeleteModal = (profile_id) => {
    setDeleteModal({
      isVisibleDelete: true,
      profileID: profile_id,
    });
  };

  const handleDelete = async () => {
    try {
      const response = await deleteProfileService({
        profile_id: deleteModal.profileID,
      });
      if (response?.data) {
        toast.success(response?.data);
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error(error.response?.data?.message);
    }
    setDeleteModal({
      ...deleteModal,
      isVisibleDelete: false,
    });
  };

  const handleClick = (id, is_josh_employee) => {
    navigate(EDITOR_PROFILE_ROUTE.replace(":profile_id", id), {
      state: { is_josh_employee },
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      closeDropdown,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={closeDropdown}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (open) => {
      if (open) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Years Of Experience",
      dataIndex: "years_of_experience",
      key: "years_of_experience",
      sorter: (a, b) => a.years_of_experience - b.years_of_experience,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Primary Skills",
      key: "primary_skills",
      dataIndex: "primary_skills",
      ...getColumnSearchProps("primary_skills"),
      render: (_, { primary_skills }) => (
        <>
          {primary_skills.map((tag, index) => {
            let color =
              tag.length > Math.floor(Math.random() * 10) + 1
                ? "geekblue"
                : "green";
            if (tag === "python") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={`${tag}-${index}`}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Is Josh Employee",
      dataIndex: "is_josh_employee",
      key: "is_josh_employee",
      render: (_, record) => (
        <>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={
              isCurrentEmpModalState.profileID === record?.id
                ? isCurrentEmpModalState.checked
                : record?.is_current_employee !== "NO"
            }
            onChange={(checked) =>
              showIsCurrentEmpModal(record?.id, checked, record)
            }
          />
          <Modals
            isVisible={
              isCurrentEmpModalState.isVisibleIsCurrentEmployee &&
              isCurrentEmpModalState.profileID === record.id
            }
            onOk={handleToggleEmployeeStatus}
            onCancel={handleToggleCancel}
            message={`Are you sure you want to ${
              isCurrentEmpModalState.record?.is_current_employee !== "NO"
                ? "inactive"
                : "active"
            } this employee?`}
          />
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <EditOutlined
              onClick={() =>
                handleClick(record?.id, record?.is_current_employee)
              }
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined onClick={() => showDeleteModal(record?.id)} />
          </Tooltip>
          <Modals
            isVisible={deleteModal.isVisibleDelete}
            onOk={handleDelete}
            onCancel={handleDeleteCancel}
            message="Are you sure you want to delete this profile?"
          />
          <Button
            type={"primary"}
            onClick={() =>
              showActiveInactiveModal(record?.id, record.is_active === "YES")
            }
          >
            {record.is_active === "YES" ? "Inactive" : "Active"}
          </Button>
          <Modals
            isVisible={toggleActiveModal.isVisibleToggleActive}
            onOk={handleToggleActiveStatus}
            onCancel={handleToggleActiveCancel}
            message={`Are you sure you want to ${
              toggleActiveModal.isActive ? "inactive" : "active"
            } this profile?`}
          />
        </Space>
      ),
    },
  ];

  const filteredData = data?.profiles?.filter((profile) =>
    activeStatus ? profile.is_active === "YES" : profile.is_active === "NO",
  );

  return (
    <>
      <Navbar />
      <Row className={styles.rowStyle}>
        <Typography.Title level={1} className={styles.profile_header}>
          Profiles
        </Typography.Title>

        <Radio.Group
          value={activeStatus ? "active" : "inactive"}
          onChange={(e) => setActiveStatus(e.target.value === "active")}
        >
          <Radio.Button value="active">Active</Radio.Button>
          <Radio.Button value="inactive">Inactive</Radio.Button>
        </Radio.Group>
        <Link to={EDITOR_ROUTE}>
          <Button type="primary" className={styles.button}>
            {" "}
            + New{" "}
          </Button>
        </Link>
      </Row>

      <Table
        tableLayout="fixed"
        size="small"
        columns={columns}
        dataSource={filteredData}
        className={styles.table}
        bordered={true}
        loading={isFetching}
      />
    </>
  );
};

export default ListProfiles;

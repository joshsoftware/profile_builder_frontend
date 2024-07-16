import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Row,
  Space,
  Switch,
  Table,
  Tag,
  Typography
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  useDeleteProfileMutation,
  useGetProfileListQuery,
  useUpdateProfileStatusMutation
} from "../../../api/profileApi";
import Modals from "../../../common-components/Modals";
import { EDITOR_PROFILE_ROUTE, EDITOR_ROUTE } from "../../../Constants";
import Navbar from "../../Navbar/navbar";
import styles from "./ListProfiles.module.css";

const ListProfiles = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const { data, isFetching } = useGetProfileListQuery();
  const [deleteProfileService] = useDeleteProfileMutation();
  const [updateProfileStatusService] = useUpdateProfileStatusMutation();
  const [modalState, setModalState] = useState({
    isVisibleDelete: false,
    isVisibleIsCurrentEmployee: false,
    isVisibleIsActive: false,
    checked: false,
    profileID: null
  });
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleToggleEmployeeStatus = async (key, modalKey) => {
    const profile_id = modalState.profileID;
    const profile_status = { [key]: modalState.checked ? "YES" : "NO" };
    try {
      const response = await updateProfileStatusService({
        profile_id,
        profile_status
      });
      console.log("response in profile:", response);
      toast.success(response?.data?.message);
    } catch (error) {
      console.error("error in profile:", error);
      toast.error(error.response?.data?.error_message);
    }

    setModalState((prevState) => ({
      ...prevState,
      [modalKey]: false,
      checked: modalState.checked,
      profileID: null
    }));
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
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
          <Button type="link" size="small" onClick={() => close()}>
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
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
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
      )
  });

  const showModal = (profile_id, modalKey, checked) => {
    setModalState({
      ...modalState,
      [modalKey]: true,
      checked: checked,
      profileID: profile_id
    });
  };
  const handleCancel = (modalKey) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalKey]: false,
      profileID: null
    }));
  };

  const handleClick = (id) => {
    navigate(EDITOR_PROFILE_ROUTE.replace(":profile_id", id));
  };

  const handleDelete = async () => {
    try {
      const response = await deleteProfileService({
        profile_id: modalState.profileID
      });
      if (response?.data) {
        toast.success(response?.data);
      }
    } catch (error) {
      console.error("error in profile : ", error);
      toast.error(error.response?.data?.error_message);
    }
    setModalState({ ...modalState, isVisibleDelete: false, profileID: null });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearchProps("name")
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ...getColumnSearchProps("email")
    },
    {
      title: "Years Of Experience",
      dataIndex: "years_of_experience",
      key: "years_of_experience",
      sorter: (a, b) => a.years_of_experience - b.years_of_experience,
      sortDirections: ["descend", "ascend"]
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
      )
    },
    {
      title: "Is Current Employee",
      dataIndex: "is_current_employee",
      key: "is_current_employee",
      render: (_, record) => (
        <>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={
              modalState.profileID === record?.id
                ? modalState.checked
                : record?.is_current_employee !== "NO"
            }
            onChange={(checked) =>
              showModal(record?.id, "isVisibleIsCurrentEmployee", checked)
            }
          />
          <Modals
            isVisible={modalState.isVisibleIsCurrentEmployee}
            onOk={() =>
              handleToggleEmployeeStatus(
                "is_current_employee",
                "isVisibleIsCurrentEmployee"
              )
            }
            onCancel={() => handleCancel("isVisibleIsCurrentEmployee")}
            message={`Are you sure you want to ${
              record?.is_current_employee !== "NO" ? "inactive" : "active"
            } this employee?`}
          />
        </>
      )
    },
    {
      title: "Is Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (_, record) => (
        <>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={
              modalState.profileID === record?.id
                ? modalState.checked
                : record?.is_active !== "NO"
            }
            onChange={(checked) =>
              showModal(record?.id, "isVisibleIsActive", checked)
            }
          />
          <Modals
            isVisible={modalState.isVisibleIsActive}
            onOk={() =>
              handleToggleEmployeeStatus("is_active", "isVisibleIsActive")
            }
            onCancel={() => handleCancel("isVisibleIsActive")}
            message={`Are you sure you want to ${
              record?.is_active !== "NO" ? "inactive" : "active"
            } this employee?`}
          />
        </>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleClick(record?.id)} />
          <DeleteOutlined
            onClick={() => showModal(record?.id, "isVisibleDelete")}
          />
          <Modals
            isVisible={modalState.isVisibleDelete}
            onOk={handleDelete}
            onCancel={() => handleCancel("isVisibleDelete")}
            message="Are you sure you want to delete this profile?"
          />
        </Space>
      )
    }
  ];

  return (
    <>
      <Navbar />
      <Row className={styles.rowStyle}>
        <Typography.Title level={1} className={styles.profile_header}>
          Profiles
        </Typography.Title>
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
        dataSource={data?.profiles}
        className={styles.table}
        bordered={true}
        loading={isFetching}
      />
    </>
  );
};

export default ListProfiles;

import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Modal, Row, Space, Table, Tag, Tooltip, Typography } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  useDeleteProfileMutation,
  useGetProfileListQuery
} from "../../../api/profileApi";
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
  const [modalState, setModalState] = useState({
    isVisible: false,
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

  const showModal = (profile_id) => {
    setModalState({ isVisible: true, profileID: profile_id });
  };

  const handleCancel = () => {
    setModalState({ isVisible: false, currentRecord: null });
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
    setModalState({ isVisible: false, profileID: null });
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
      render: (is_current_employee) => is_current_employee,
      sorter: (a, b) => a.isCurrentEmployee - b.isCurrentEmployee,
      sortDirections: ["descend", "ascend"]
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <EditOutlined onClick={() => handleClick(record?.id)} />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined onClick={() => showModal(record?.id)} />
          </Tooltip>
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
      <Modal
        title="Confirm Delete"
        centered
        open={modalState.isVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
        okButtonProps={{
          style: { backgroundColor: "red" }
        }}
      >
        Are you sure you want to delete?
      </Modal>
    </>
  );
};

export default ListProfiles;

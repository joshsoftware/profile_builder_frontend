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
  Spin,
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
import dayjs from "dayjs";
import { useUserEmailMutation } from "../../../api/emailApi";
import {
  useDeleteProfileMutation,
  useGetProfileListQuery,
  useUpdateProfileStatusMutation,
} from "../../../api/profileApi";
import { EDITOR_PROFILE_ROUTE, EDITOR_ROUTE } from "../../../Constants";
import {
  calculateTotalExperience,
  formatDate,
  showConfirm,
} from "../../../helpers";
import Navbar from "../../Navbar";
import styles from "./ListProfiles.module.css";

const ListProfiles = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [activeStatus, setActiveStatus] = useState(true);
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const { data, isFetching, refetch } = useGetProfileListQuery();
  const [deleteProfileService] = useDeleteProfileMutation();
  const [updateProfileStatusService] = useUpdateProfileStatusMutation();
  const [sendInvitationService, { isLoading }] = useUserEmailMutation();

  const showActiveInactiveModal = (profile_id, isActive) => {
    showConfirm({
      onOk: async () => {
        const is_active = isActive ? "NO" : "YES";
        try {
          const response = await updateProfileStatusService({
            profile_id,
            profile_status: { is_active },
          });
          toast.success(response?.data?.message);
        } catch (error) {
          toast.error(error.response?.data?.error_message);
        }
      },
      onCancel: () => {},
      message: `Are you sure you want to ${
        isActive ? "inactive" : "active"
      } this profile?`,
    });
  };

  const showIsCurrentEmpModal = (profile_id, checked) => {
    showConfirm({
      onOk: async () => {
        const profile_status = {
          is_current_employee: checked ? "YES" : "NO",
        };
        try {
          const response = await updateProfileStatusService({
            profile_id,
            profile_status,
          });
          toast.success(response?.data?.message);
        } catch (error) {
          toast.error(error.response?.data?.error_message);
        }
      },
      onCancel: () => {},
      message: `Are you sure you want to ${
        checked ? "active" : "inactive"
      } this employee?`,
    });
  };

  const showDeleteModal = (profile_id) => {
    showConfirm({
      onOk: async () => {
        try {
          const response = await deleteProfileService({
            profile_id: profile_id,
          });
          if (response?.data) {
            toast.success(response?.data);
          }
        } catch (error) {
          console.error("Error deleting profile:", error);
          toast.error(error.response?.data?.error_message);
        }
      },
      onCancel: () => {},
      message: "Are you sure you want to delete this profile?",
    });
  };

  const handleSendInvite = (profile_id) => {
    showConfirm({
      onOk: async () => {
        try {
          const response = await sendInvitationService({
            profile_id,
          });
          if (response?.data) {
            toast.success(response?.data?.message);
            await refetch();
          }
        } catch (error) {
          toast.error(error.response?.data?.error_message);
        }
      },
      onCancel: () => {},
      message: "Are you sure you want to send invitation?",
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
      width: "13%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "18%",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Years Of Experience",
      dataIndex: "total_experience",
      key: "total_experience",
      sorter: (a, b) => a.total_experience - b.total_experience,
      sortDirections: ["descend", "ascend"],
      render: (text) => text + "+",
    },
    {
      title: "Primary Skills",
      key: "primary_skills",
      dataIndex: "primary_skills",
      ...getColumnSearchProps("primary_skills"),
      render: (_, { primary_skills }) => (
        <>
          {primary_skills?.map((tag, index) => {
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
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
      sortDirections: ["descend", "ascend"],
      render: (date) => formatDate(date),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: (a, b) => dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),
      sortDirections: ["descend", "ascend"],
      render: (date) => formatDate(date),
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
            checked={record?.is_current_employee === "YES"}
            onChange={(checked) => showIsCurrentEmpModal(record?.id, checked)}
          />
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "20%",
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
          <Tooltip title="Active/Deactive user">
            <Button
              type={"primary"}
              size="small"
              onClick={() =>
                showActiveInactiveModal(record?.id, record.is_active === "YES")
              }
            >
              {record.is_active === "YES" ? "Inactive" : "Active"}
            </Button>
          </Tooltip>
          <Tooltip title="Send invite. Disabled button indicates that invitation has been already sent.">
            <Button
              type={"primary"}
              size="small"
              disabled={record?.is_profile_complete === "YES"}
              onClick={() => handleSendInvite(record?.id)}
            >
              Send Invite
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = data?.profiles?.filter((profile) =>
    activeStatus ? profile.is_active === "YES" : profile.is_active === "NO",
  );

  const transformProfilesData = () => {
    return filteredData?.map((profile) => ({
      ...profile,
      total_experience: calculateTotalExperience(
        profile?.years_of_experience,
        profile?.josh_joining_date,
      ),
    }));
  };

  return (
    <>
      <Spin spinning={isLoading} size="large" tip={"Just a moment.."}>
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
          dataSource={transformProfilesData()}
          className={styles.table}
          bordered={true}
          loading={isFetching}
        />
      </Spin>
    </>
  );
};

export default ListProfiles;

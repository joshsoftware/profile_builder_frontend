import React from "react";
import { Skeleton, Table } from "antd";
import { columns } from "../../../utils/dto/constants";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../../services/axios";

const ListProfiles = () => {
  const { isFetching, data, error, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await get(`/list_profiles`);
        return response.data.profiles;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <React.Fragment>
      {isFetching && <Skeleton active />}
      {error && <p>Failed to fetch list of Profile!</p>}
      {data && !isFetching && <Table columns={columns} dataSource={data} />}
    </React.Fragment>
  );
};

export default ListProfiles;

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { API } from "../../utils/api";

const UserPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [fetchUser, setFetchUser] = useState<any>();
  const FetchUser = async () => {
    const response: any = await API.get(`/user/${id}`);
    console.log(response, "rsss");
    setFetchUser(response?.data);
  };
  useEffect(() => {
    FetchUser();
  }, []);

  return <div>{fetchUser?.name}</div>;
};

export default UserPage;

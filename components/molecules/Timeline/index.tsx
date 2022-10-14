import { Heading } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../../../utils/api";

const Timeline = () => {
  const [fetchUser, setFetchUser] = useState<any>();
  const [diagnosis, setDiagnosis] = useState<any>();
  const FetchData = async () => {
    try {
      const response: any = axios.get("http://localhost:5000/diagnosis/get");
      setDiagnosis(response?.response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {}, []);
  return (
    <div>
      <Heading>Diagnosis Timeline</Heading>
    </div>
  );
};

export default Timeline;

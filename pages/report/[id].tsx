import { useRouter } from "next/router";
import React from "react";

const Report = () => {
  const router = useRouter();
  const id = router.query.id;
  return <div>Report</div>;
};

export default Report;

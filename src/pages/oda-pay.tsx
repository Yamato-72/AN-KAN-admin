// src/pages/oda-pay.tsx
import React from "react";
import { IframeWithLoading } from "@/components/IframeWithLoading";

export default function ProductMaster() {
  return (
    <div style={{ height: "calc(100vh - 60px)", width: "100%" }}>
      <IframeWithLoading
        src="https://oda-pay-47228502594.europe-west1.run.app/index"
        title="支払管理"
        height="100%"
      />
    </div>
  );
}
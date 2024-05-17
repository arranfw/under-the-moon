import { getConnectionsData } from "@/util/api/connections";
import { LocalDate } from "@js-joda/core";
import React, { useState } from "react";
import { TestComponent } from "./TestComponent";

const TestPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const date =
    typeof searchParams.date === "string"
      ? LocalDate.parse(searchParams.date)
      : LocalDate.now().minusDays(1);
  const connectionsData = await getConnectionsData(date);

  return (
    <div className="w-full flex justify-center p-12">
      <TestComponent gameData={connectionsData} />
    </div>
  );
};

export default TestPage;

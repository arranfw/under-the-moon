import { ConnectionsDateNavLink } from "@/components/ConnectionsDateNavLink";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { DateTimeFormatter, LocalDate } from "@js-joda/core";
import "@js-joda/locale_en";
import { Locale } from "@js-joda/locale_en";
import React from "react";

const dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy").withLocale(
  Locale.ENGLISH,
);

interface ConnectionsLayoutProps extends React.PropsWithChildren {
  params: { date: string };
}

const ConnectionsLayout: React.FC<ConnectionsLayoutProps> = ({
  children,
  params,
}) => {
  const date =
    typeof params.date === "string"
      ? LocalDate.parse(params.date)
      : LocalDate.now();

  const todayString = date.format(dateFormatter);

  return (
    <div className="h-full md:w-120 w-full flex flex-col m-auto">
      <div className="flex items-center flex-col gap-6 mb-6">
        <div className="flex items-end gap-2">
          <h1 className="text-4xl font-bold">Connections</h1>
        </div>
        <div className="flex w-full justify-between items-center">
          <ConnectionsDateNavLink
            href={`/connections/${date.minusDays(1).toJSON()}`}
            icon={faAngleLeft}
          />
          <p className="text-lg">{todayString}</p>
          <ConnectionsDateNavLink
            href={`/connections/${date.plusDays(1).toJSON()}`}
            icon={faAngleRight}
          />
        </div>
        <p>Create four groups of four!</p>
      </div>
      {children}
    </div>
  );
};

export default ConnectionsLayout;

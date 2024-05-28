import React from "react";

import { ConnectionsActionButton } from "@/components/connections/ActionButton";
import { Divider } from "@/components/Divider";
import { dayMonthYearFormatter } from "@/util/date";

import {
  faBugs,
  faMinus,
  faPlus,
  faStarOfLife,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LocalDate } from "@js-joda/core";
import Link from "next/link";

interface ChangeIndicatorProps {
  type: "add" | "remove" | "fix" | "change";
}

const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({ type }) => {
  const iconMap = {
    add: faPlus,
    remove: faMinus,
    fix: faBugs,
    change: faStarOfLife,
  };
  const colorMap = {
    add: "text-green-500",
    remove: "text-red-500",
    fix: "text-orange-500",
    change: "text-purple-500",
  };
  return (
    <FontAwesomeIcon
      icon={iconMap[type]}
      className={colorMap[type]}
      fixedWidth
    />
  );
};

interface ChangeDayProps extends React.PropsWithChildren {
  date: LocalDate;
}

const ChangeDay: React.FC<ChangeDayProps> = ({ date, children }) => {
  return (
    <div className="mb-2">
      <h2 className="text-xl font-bold">
        {date.format(dayMonthYearFormatter)}
      </h2>
      <Divider className="my-2" />
      {children}
    </div>
  );
};

const ChangeSectionHeader: React.FC<React.PropsWithChildren> = ({
  children,
}) => <h3 className="text-lg font-bold">{children}</h3>;

interface PageProps {}

const Page: React.FC<PageProps> = () => {
  return (
    <div className="h-full md:w-2/3 flex flex-col m-auto">
      <div className="flex items-center flex-col gap-6 mb-6">
        <h1 className="text-4xl font-bold">What's new</h1>
        <div className="w-full">
          <ChangeDay date={LocalDate.parse("2024-05-27")}>
            <ChangeSectionHeader>Connections:</ChangeSectionHeader>
            <ul>
              <li>
                <ChangeIndicator type="change" />{" "}
                <div className="inline-flex scale-75 -mx-2">
                  <ConnectionsActionButton>Shuffle</ConnectionsActionButton>
                </div>{" "}
                sorts marked items to the top
              </li>
              <li>
                <ChangeIndicator type="fix" /> Fixed Game Summary clipping off
                the end of the screen
              </li>
              <li>
                <ChangeIndicator type="fix" /> Fixed layout shifts when opening
                nav menu
              </li>
              <li>
                <ChangeIndicator type="remove" /> Removed streaks from the{" "}
                <Link className="underline" href="/connections/results">
                  Recent Results
                </Link>{" "}
                page.
              </li>
              <li>
                <ChangeIndicator type="add" /> Added recent{" "}
                <b>puzzle completion count</b> to the{" "}
                <Link className="underline" href="/connections/results">
                  Recent Results
                </Link>{" "}
                page, this how many puzzles each person has completed in the
                last 12 days
              </li>
              <li>
                <ChangeIndicator type="add" /> Added{" "}
                <b>recent score averages</b> to the{" "}
                <Link className="underline" href="/connections/results">
                  Recent Results
                </Link>{" "}
                page, this shows the average score of all completions in the
                last 12 days per person
              </li>
            </ul>
          </ChangeDay>
          <ChangeDay date={LocalDate.parse("2024-05-26")}>
            <ChangeSectionHeader>Connections:</ChangeSectionHeader>
            <ul>
              <li>
                <ChangeIndicator type="add" />{" "}
                <Link className="underline" href="/connections/results">
                  Recent Results
                </Link>
                : Check out eveyone's results from the last 12 days in one place
                and a beta for streaks
              </li>
            </ul>
          </ChangeDay>
        </div>
      </div>
    </div>
  );
};

export default Page;

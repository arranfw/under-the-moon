import React from "react";

import { ConnectionsActionButton } from "@/components/connections/ActionButton";
import { Divider } from "@/components/Divider";
import { Link } from "@/components/Link";
import { dayMonthYearFormatter } from "@/util/date";

import {
  faBugs,
  faMinus,
  faPlus,
  faStarOfLife,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LocalDate } from "@js-joda/core";

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

const LATEST_CHANGE_DATE = LocalDate.parse("2024-06-02");
const now = LocalDate.now();
export const hasRecentChanges = now.minusDays(7).isBefore(LATEST_CHANGE_DATE);

interface PageProps {}

const Page: React.FC<PageProps> = () => {
  return (
    <div className="flex items-center flex-col gap-6 mb-6">
      <h1 className="text-4xl font-bold">What's new</h1>
      <div className="w-full">
        <ChangeDay date={LocalDate.parse("2024-06-02")}>
          <ChangeSectionHeader>Circles:</ChangeSectionHeader>
          <ul>
            <li>
              <ChangeIndicator type="add" /> Added{" "}
              <Link href="/circles">Circles</Link>! Your results and any future
              data will only be visible to you and people in your circles
            </li>
          </ul>
          <ChangeSectionHeader>Connections:</ChangeSectionHeader>
          <ul>
            <li>
              <ChangeIndicator type="change" /> Connections results are only
              shown for players in your circles
            </li>
          </ul>
        </ChangeDay>
        <ChangeDay date={LocalDate.parse("2024-05-28")}>
          <ChangeSectionHeader>Connections:</ChangeSectionHeader>
          <ul>
            <li>
              <ChangeIndicator type="fix" /> Fixed an issue with game completion
              state not showing, thanks Jason
            </li>
          </ul>
        </ChangeDay>
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
              <ChangeIndicator type="fix" /> Fixed Game Summary clipping off the
              end of the screen
            </li>
            <li>
              <ChangeIndicator type="fix" /> Fixed layout shifts when opening
              nav menu
            </li>
            <li>
              <ChangeIndicator type="fix" /> Fixed iOS text selection issue when
              attempting to label words, thanks Carly
            </li>
            <li>
              <ChangeIndicator type="remove" /> Removed streaks from the{" "}
              <Link href="/connections/results">Recent Results</Link> page.
            </li>
            <li>
              <ChangeIndicator type="add" /> Added recent{" "}
              <b>puzzle completion count</b> to the{" "}
              <Link href="/connections/results">Recent Results</Link> page, this
              how many puzzles each person has completed in the last 12 days
            </li>
            <li>
              <ChangeIndicator type="add" /> Added <b>recent score averages</b>{" "}
              to the <Link href="/connections/results">Recent Results</Link>{" "}
              page, this shows the average score of all completions in the last
              12 days per person
            </li>
            <li>
              <ChangeIndicator type="add" /> Solution is now shown when failing
              the game, thanks Carly
            </li>
          </ul>
        </ChangeDay>
        <ChangeDay date={LocalDate.parse("2024-05-26")}>
          <ChangeSectionHeader>Connections:</ChangeSectionHeader>
          <ul>
            <li>
              <ChangeIndicator type="add" />{" "}
              <Link href="/connections/results">Recent Results</Link>: Check out
              eveyone's results from the last 12 days in one place and a beta
              for streaks
            </li>
          </ul>
        </ChangeDay>
      </div>
    </div>
  );
};

export default Page;

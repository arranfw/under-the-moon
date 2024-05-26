import React from "react";

import { Avatar } from "@/components/Avatar";
import { Tooltip } from "@/components/ToolTip";
import {
  getConnectionsResults,
  getConnectionsStreaks,
} from "@/db/repositories";
import { cn } from "@/util";

import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChronoField, LocalDate } from "@js-joda/core";
import { partition, times } from "lodash";

export const revalidate = 60;

interface PageProps {}

const Page: React.FC<PageProps> = async () => {
  const now = LocalDate.now();
  const resultDays = 12;
  const recentResults = await getConnectionsResults({
    orderBy: {
      column: "score",
      dir: "desc",
    },
    dateRange: {
      start: now.minusDays(resultDays).toJSON(),
    },
  });
  const streaks = await getConnectionsStreaks(now.toJSON());

  const resultsForDay = (date: LocalDate) =>
    partition(
      recentResults,
      (result) => LocalDate.parse(result.date).toJSON() === date.toJSON(),
    )[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-center mb-6">
        <p className="text-lg">Recent results</p>
      </div>
      <div className="w-full flex">
        {times(resultDays, (i) => (
          <div
            key={i}
            className={cn(
              "w-1/12 flex gap-2 flex-col items-center justify-between grow-1",
              "border-l first:border-none",
              "border-zinc-400 border-opacity-50 dark:border-zinc-800",
            )}
          >
            <div className="flex flex-col gap-2">
              {resultsForDay(now.minusDays(resultDays - i - 1)).map(
                (result) => (
                  <Tooltip
                    key={result.id}
                    tooltipContent={
                      <p>
                        {result.name}: {result.score}
                      </p>
                    }
                  >
                    <Avatar
                      className={cn("text-xs border border-slate-600", {
                        "outline outline-yellow-600 dark:outline-yellow-400":
                          result.score === 100,
                      })}
                      size={24}
                      imageUrl={result.image || ""}
                      fallbackText={
                        result.name
                          ?.split(" ")
                          .slice(0, 2)
                          .map((s) => s.charAt(0))
                          .join("") || ""
                      }
                    />
                  </Tooltip>
                ),
              )}
            </div>
            <div
              className={cn(
                "flex w-5/6 justify-center items-center",
                "aspect-square rounded-full",
              )}
            >
              <p className="text-lg">
                {now
                  .minusDays(resultDays - i - 1)
                  .get(ChronoField.DAY_OF_MONTH)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col justify-center mb-6">
        <h2 className="text-lg place-self-center">Streaks (beta)</h2>
        <div className="flex flex-col items-start">
          {streaks.map((streak) => (
            <div key={streak.name} className="flex gap-2">
              <p>
                {streak.date === now.toJSON() ? "🔥" : "⌛"} {streak.streak}
              </p>
              <p>{streak.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;

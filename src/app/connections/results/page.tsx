import React from "react";

import { auth } from "@/auth";
import { Avatar } from "@/components/Avatar";
import { Divider } from "@/components/Divider";
import { Link } from "@/components/Link";
import { Tooltip } from "@/components/ToolTip";
import {
  getConnectionsResults,
  getUserResultCount,
  getUserScoreAverages,
} from "@/db/repositories";
import { getUserCircles } from "@/db/repositories/circles";
import { cn, nameToFallbackText } from "@/util";

import { ChronoField, LocalDate } from "@js-joda/core";
import { partition, times } from "lodash";

export const revalidate = 60;

interface PageProps {}

const Page: React.FC<PageProps> = async () => {
  const session = await auth();
  const now = LocalDate.now();
  const resultDays = 12;

  const userCircles = session?.user?.id
    ? await getUserCircles(session?.user?.id)
    : null;

  const recentResults = session?.user?.id
    ? await getConnectionsResults({
        userId: session.user.id,
        orderBy: {
          column: "score",
          dir: "desc",
        },
        dateRange: {
          start: now.minusDays(resultDays).toJSON(),
          end: now.toJSON(),
        },
        includeCircles: true,
      })
    : null;
  const resultCount = session?.user?.id
    ? await getUserResultCount({
        userId: session.user.id,
        dateRange: {
          start: now.minusDays(resultDays).toJSON(),
          end: now.toJSON(),
        },
      })
    : null;
  const totalScores = session?.user?.id
    ? await getUserScoreAverages({
        userId: session.user.id,
        dateRange: {
          start: now.minusDays(resultDays).toJSON(),
          end: now.toJSON(),
        },
      })
    : null;

  const resultsForDay = (date: LocalDate) =>
    partition(
      recentResults,
      (result) => LocalDate.parse(result.date).toJSON() === date.toJSON(),
    )[0];

  if (!session) {
    return <h2>Please sign in to view Results</h2>;
  }

  return (
    <>
      <div className="w-full flex justify-center mb-6">
        <h2 className="text-lg">
          Recent results <small>(Last 12 days)</small>
        </h2>
      </div>

      {userCircles?.length === 0 && (
        <div className="w-full">
          <Link href={`/circles`}>Join a circle</Link> to see other player's
          results
        </div>
      )}

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
                        "border-2 border-yellow-500 dark:border-yellow-400":
                          result.score === 100,
                      })}
                      size={24}
                      imageUrl={result.image}
                      fallbackText={nameToFallbackText(result.name)}
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

      <Divider />

      <div className="w-full flex flex-col justify-center mb-6">
        <h2 className="text-lg place-self-center">
          Completed Puzzles <small>(Last 12 days)</small>
        </h2>
        <div className="flex flex-col items-start">
          {resultCount?.map((streak) => (
            <div key={streak.name} className="flex gap-2">
              <p>{streak.count}</p>
              <p>{streak.name}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div className="w-full flex flex-col justify-center mb-6">
        <h2 className="text-lg place-self-center">
          Player score averages <small>(Last 12 days)</small>
        </h2>
        <div className="flex flex-col items-start">
          {totalScores?.map((scoreTotal) => (
            <div key={scoreTotal.name} className="flex gap-2">
              <p>{parseFloat(scoreTotal.scoreAverage).toFixed(1)}</p>
              <p>{scoreTotal.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;

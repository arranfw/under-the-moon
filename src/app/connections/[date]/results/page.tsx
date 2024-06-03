import { ConnectionsDateNavLink } from "@/components/connections/DateNavLink";
import {
  difficultyEmojiMap,
  gameDateToGameNumber,
} from "@/components/connections/util";
import { getConnectionsResults } from "@/db/repositories";
import { cn } from "@/util";
import {
  dayMonthYearFormatter,
  LocalDateShortTime,
  shortTimeFormatter,
} from "@/util/date";

import {
  faAngleLeft,
  faAngleRight,
  faCrown,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LocalDate } from "@js-joda/core";

import "@js-joda/locale_en";

import React from "react";

import { auth } from "@/auth";
import { Link } from "@/components/Link";
import { getUserCircles } from "@/db/repositories/circles";

const Page = async ({ params }: { params: { date: string } }) => {
  const session = await auth();
  const date =
    typeof params.date === "string"
      ? LocalDate.parse(params.date)
      : LocalDate.now();
  const todayString = date.format(dayMonthYearFormatter);

  const userCircles = session?.user?.id
    ? await getUserCircles(session?.user?.id)
    : null;

  const results = session?.user?.id
    ? await getConnectionsResults({
        userId: session?.user.id,
        dateRange: {
          start: params.date,
          end: params.date,
        },
        orderBy: {
          column: "score",
          dir: "desc",
        },
        includeCircles: true,
      })
    : null;

  return (
    <>
      <div className="flex w-full justify-between items-center">
        <ConnectionsDateNavLink
          href={`/connections/${date.minusDays(1).toJSON()}/results`}
          icon={faAngleLeft}
        />
        <p className="text-lg">{todayString}</p>
        <ConnectionsDateNavLink
          href={`/connections/${date.plusDays(1).toJSON()}/results`}
          icon={faAngleRight}
        />
      </div>
      <div className="grid grid-cols-3 w-full">
        <Link
          variant="no-underline"
          className={cn("places-self-start", "")}
          href={`/connections/${date}`}
        >
          <FontAwesomeIcon icon={faTableCellsLarge} /> Back to game
        </Link>
        <p className="place-self-center">
          Puzzle #{gameDateToGameNumber(params.date)}
        </p>{" "}
      </div>

      {!session?.user?.id && (
        <div className="w-full h-56 grid place-content-center text-xl">
          Please log in to see results
        </div>
      )}

      {userCircles?.length === 0 && (
        <div className="w-full">
          <Link href={`/circles`}>Join a circle</Link> to see other player's
          results
        </div>
      )}

      {results?.length === 0 && (
        <div className="w-full h-56 grid place-content-center text-xl">
          No results yet!
        </div>
      )}
      {results?.map((result, i) => (
        <div
          key={result.id}
          className={cn(
            "rounded-md m-1 p-4 w-full flex items-center justify-between gap-4 relative",
            "border border-border",
          )}
        >
          {(i === 0 || Math.round(result.score) === 100) && (
            <FontAwesomeIcon
              className="absolute -top-3 -left-3 text-yellow-600  -rotate-45"
              icon={faCrown}
              fontSize={20}
            />
          )}
          <div className="flex flex-col gap-1">
            {result.name && <h2 className="font-bold">{result.name}</h2>}
            <p>
              Score:{" "}
              <span className="font-bold">
                {Math.round(result.score) === 100
                  ? "💯"
                  : Math.round(result.score)}
              </span>
            </p>
            <p>
              Guesses: <span className="font-bold">{result.guessCount}</span>
            </p>
            <p>
              Hints: <span className="font-bold">{result.hintCount}</span>{" "}
            </p>
            {result.createdAt && (
              <p>
                Time:{" "}
                <span className="font-bold">
                  <LocalDateShortTime date={result.createdAt} />
                </span>
              </p>
            )}
          </div>
          {result.summary && (
            <div className="shrink-0">
              {result.summary.map((category, i) => (
                <p key={`${i}`}>
                  {category.map((summaryItem, j) => (
                    <span key={`${i}-${j}`}>
                      {difficultyEmojiMap[summaryItem]}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Page;

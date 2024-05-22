import { LocalDate } from "@js-joda/core";
import "@js-joda/locale_en";
import { getConnectionsResults } from "@/db/repositories";
import { ConnectionsDateNavLink } from "@/components/connections/DateNavLink";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { dayMonthYearFormatter } from "@/util/date";
import { cn } from "@/util";
import {
  difficultyEmojiMap,
  gameDateToGameNumber,
} from "@/components/connections/util";
import Link from "next/link";

const ConnectionsResults = async ({ params }: { params: { date: string } }) => {
  const date =
    typeof params.date === "string"
      ? LocalDate.parse(params.date)
      : LocalDate.now();
  const todayString = date.format(dayMonthYearFormatter);

  const results = await getConnectionsResults({ date: params.date });

  return (
    <>
      <div className="flex items-center flex-col gap-6 mb-6">
        <div className="flex items-end gap-2">
          <h1 className="text-4xl font-bold">Connections</h1>
        </div>
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
        <p>Puzzle #{gameDateToGameNumber(params.date)}</p>{" "}
      </div>
      <Link
        className={cn(
          "rounded-md m-1 p-2 flex flex-col items-center justify-center relative",
          "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700",
        )}
        href={`/connections/${date}`}
      >
        Back to game
      </Link>
      {results.length === 0 && (
        <div className="w-full h-56 grid place-content-center text-xl">
          No results yet!
        </div>
      )}
      {results.map((result) => (
        <div
          key={result.id}
          className={cn(
            "rounded-md m-1 p-4 flex items-center justify-between relative",
            "bg-gray-200 dark:bg-gray-800",
          )}
        >
          <div className="flex flex-col justify-between gap-5">
            {result.name && <h2 className="font-bold">{result.name}</h2>}
            <p className="tracking-wider">
              <span className="font-bold">
                {Math.round(result.score) === 100
                  ? "💯"
                  : Math.round(result.score)}
              </span>{" "}
              points in <span className="font-bold">{result.guessCount}</span>{" "}
              guesses with <span className="font-bold">{result.hintCount}</span>{" "}
              hint
              {result.hintCount !== 1 && "s"}
            </p>
          </div>
          {result.summary && (
            <div className="">
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

export default ConnectionsResults;

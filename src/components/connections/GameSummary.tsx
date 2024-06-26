import React, { useRef } from "react";

import { cn } from "@/util";

import { CopyButton } from "../CopyButton";
import { difficultyEmojiMap } from "./util";
import Link from "next/link";
import { useParams } from "next/navigation";

interface GameSummaryProps {
  gameNumber: number;
  gameSummary: number[][] | undefined;
  score: number;
  guessCount: number;
  hintsUsed: number | undefined;
}

export const GameSummary: React.FC<GameSummaryProps> = ({
  gameNumber,
  gameSummary,
  score,
  guessCount,
  hintsUsed,
}) => {
  const { date } = useParams();

  const gameCompletedRef = useRef<HTMLDivElement>(null);

  const getInnerText = () => {
    return gameCompletedRef.current?.innerText.replaceAll("\n\n", "\n");
  };

  return (
    <>
      <div
        ref={gameCompletedRef}
        className={cn(
          "rounded-md m-1 p-2 flex flex-col items-center justify-center relative",
          "bg-gray-200 dark:bg-gray-800",
          "animate-slideDown",
        )}
      >
        <div className="absolute top-2 right-2">
          <CopyButton getCopyText={getInnerText} />
        </div>
        <p>Connections</p>
        <p>Puzzle #{gameNumber}</p>{" "}
        {gameSummary && (
          <div className="mb-2">
            {gameSummary.map((category, i) => (
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
        <p className="tracking-wider">
          <span className="font-bold">
            {Math.round(score) === 100 ? "💯" : Math.round(score)}
          </span>{" "}
          points in <span className="font-bold">{guessCount}</span> guesses with{" "}
          <span className="font-bold">{hintsUsed}</span> hint
          {hintsUsed !== 1 && "s"}
        </p>
      </div>
    </>
  );
};

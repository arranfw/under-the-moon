"use client";

import { useGame } from "@/app/connections/useGame";
import { chunk, cn } from "@/util";
import {
  ConnectionsData,
  connectionsDataToGameState,
} from "@/util/api/connections";
import { LocalDate } from "@js-joda/core";
import React, { useState } from "react";
import { ConnectionsActionButton } from "./ConnectionsActionButton";
import { ConnectionsItem } from "./ConnectionsItem";

interface ConnectionsGameProps {
  gameData: ConnectionsData;
}

export const ConnectionsGame: React.FC<ConnectionsGameProps> = ({
  gameData,
}) => {
  const options = React.useMemo(
    () => ({
      groups: connectionsDataToGameState(gameData),
    }),
    [gameData],
  );
  const { game, deselectAll, shuffleGame, submit, foundGroup, toggleActive } =
    useGame(options);

  const [jigglingIncorrect, setJigglingIncorrect] = useState<string[]>([]);

  const handleSubmit = () => {
    const currentGuess = [...game.activeItems];
    if (!foundGroup) {
      setJigglingIncorrect(currentGuess);
      setTimeout(() => {
        setJigglingIncorrect([]);
        submit();
      }, 1000);
    } else {
      submit();
    }
  };

  return (
    <>
      <div>
        {game.complete.map((group) => (
          <div
            key={group.title}
            className={cn(
              `w-full flex flex-col justify-center items-center
              mb-2 rounded-md color-black tracking-wider uppercase h-20
              text-black`,
              {
                "bg-connections-difficulty-1": group.difficulty === 1,
                "bg-connections-difficulty-2": group.difficulty === 2,
                "bg-connections-difficulty-3": group.difficulty === 3,
                "bg-connections-difficulty-4": group.difficulty === 4,
              },
            )}
          >
            <p className="font-bold">{group.title}</p>
            <p>{group.cards.map((card) => card.content).join(", ")}</p>
          </div>
        ))}

        <div className="grid grid-cols-4 gap-2 mb-4">
          {game.items.map((item) => (
            <ConnectionsItem
              key={item}
              onClick={() => toggleActive(item)}
              active={game.activeItems.includes(item)}
              jiggle={jigglingIncorrect.includes(item)}
            >
              {item}
            </ConnectionsItem>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center mb-4">
        <div className="flex items-center gap-2">
          <p>Mistakes remaining:</p>
          <div className="flex gap-2">
            {Array(4)
              .fill("")
              .map((_, i) => (
                <div
                  key={i}
                  className={cn("rounded-full w-4 h-4", {
                    "bg-connections-button-active dark:bg-white":
                      i <= game.mistakesRemaining,
                  })}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center gap-2">
        <ConnectionsActionButton onClick={shuffleGame}>
          Shuffle
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={deselectAll}
          disabled={game.activeItems.length < 1}
        >
          Deselect All
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={handleSubmit}
          disabled={game.activeItems.length !== 4}
        >
          Submit
        </ConnectionsActionButton>
      </div>
    </>
  );
};

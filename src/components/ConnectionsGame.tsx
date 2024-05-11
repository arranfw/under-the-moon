"use client";

import { useGame } from "@/app/connections/useGame";
import { chunk, cn } from "@/util";
import { connectionsDataToGameState } from "@/util/api/connections";
import React from "react";
import { ConnectionsActionButton } from "./ConnectionsActionButton";
import { ConnectionsItem } from "./ConnectionsItem";

interface ConnectionsGameProps {
  gameData: any;
}

export const ConnectionsGame: React.FC<ConnectionsGameProps> = ({
  gameData,
}) => {
  const { game, deselectAll, shuffleGame, submit, toggleActive } = useGame({
    groups: connectionsDataToGameState(gameData),
  });

  return (
    <>
      <div>
        {game.complete.map((group) => (
          <div
            className={cn(
              `w-full flex flex-col justify-center items-center mb-2 rounded-md color-black  tracking-wider uppercase h-20`,
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
              onClick={() => toggleActive(item)}
              active={game.activeItems.includes(item)}
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
                  className={cn("rounded-full w-4 h-4", {
                    "bg-connections-button-active": i <= game.mistakesRemaining,
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
        <ConnectionsActionButton onClick={deselectAll}>
          Deselect All
        </ConnectionsActionButton>
        <ConnectionsActionButton
          disabled={game.activeItems.length !== 4}
          onClick={submit}
        >
          Submit
        </ConnectionsActionButton>
      </div>
    </>
  );
};

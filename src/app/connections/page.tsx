"use client";

import { ConnectionsActionButton } from "@/components/ConnectionsActionButton";
import { ConnectionsItem } from "@/components/ConnectionsItem";
import { useState } from "react";
import { chunk, cn, shuffle } from "../util";
import { DAY_1 } from "./constants";

export type Group = {
  category: string;
  items: string[];
  difficulty: 1 | 2 | 3 | 4;
};

type Options = {
  groups: Group[];
};

type State = {
  complete: Group[];
  incomplete: Group[];
  items: string[];
  activeItems: string[];
  mistakesRemaining: number;
};

const difficultyColor = (difficulty: 1 | 2 | 3 | 4): string => {
  return {
    1: "#fbd400",
    2: "#b5e352",
    3: "#729eeb",
    4: "#bc70c4",
  }[difficulty];
};

const useGame = (options: Options) => {
  const initialState: State = {
    incomplete: options.groups,
    complete: [],
    items: shuffle(options.groups.flatMap((g) => g.items)),
    activeItems: [],
    mistakesRemaining: 3,
  };

  const [game, setGame] = useState(initialState);

  const toggleActive = (item: string) => {
    if (game.activeItems.includes(item)) {
      setGame((prev) => ({
        ...game,
        activeItems: prev.activeItems.filter((i) => i !== item),
      }));
    } else if (game.activeItems.length < 4) {
      setGame((prev) => ({
        ...game,
        activeItems: [...prev.activeItems, item],
      }));
    }
  };

  const shuffleGame = () => {
    setGame((prev) => ({
      ...game,
      items: shuffle(game.items),
    }));
  };

  const deselectAll = () => {
    setGame((prev) => ({
      ...game,
      activeItems: [],
    }));
  };

  const submit = () => {
    const foundGroup = game.incomplete.find((group) =>
      group.items.every((item) => game.activeItems.includes(item)),
    );

    if (foundGroup) {
      const incomplete = game.incomplete.filter(
        (group) => group !== foundGroup,
      );
      setGame((prev) => ({
        ...game,
        complete: [...prev.complete, foundGroup],
        incomplete: [...incomplete],
        items: incomplete.flatMap((group) => group.items),
        activeItems: [],
      }));
    } else {
      setGame((prev) => ({
        ...game,
        mistakesRemaining: prev.mistakesRemaining - 1,
        activeItems: [],
      }));
      if (game.mistakesRemaining === 0) {
        setGame((prev) => ({
          ...game,
          complete: [...prev.incomplete],
          incomplete: [],
          items: [],
          activeItems: [],
        }));
      }
    }
  };

  return {
    toggleActive,
    shuffleGame,
    deselectAll,
    submit,
    game,
  };
};

const Connections = () => {
  const { game, deselectAll, shuffleGame, submit, toggleActive } = useGame({
    groups: DAY_1,
  });

  return (
    <div className="h-full bg-white">
      <div className="flex justify-center">
        <div className="w-96 ">
          <h1 className="text-4xl mb-4">Connections</h1>
          <p className="w-full text-center mb-4">Create four groups of four!</p>
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
                <p className="font-bold">{group.category}</p>
                <p>{group.items.join(", ")}</p>
              </div>
            ))}

            <div className="grid grid-cols-4 gap-2 mb-4">
              {chunk(game.items, 4).map((row) => (
                <>
                  {row.map((item) => (
                    <ConnectionsItem
                      onClick={() => toggleActive(item)}
                      active={game.activeItems.includes(item)}
                    >
                      {item}
                    </ConnectionsItem>
                  ))}
                </>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <p>Mistakes remaining:</p>{" "}
              <div className="flex gap-2">
                {Array(4)
                  .fill("")
                  .map((_, i) => (
                    <div
                      className={cn("rounded-full w-4 h-4", {
                        "bg-connections-button-active":
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
        </div>
      </div>
    </div>
  );
};

export default Connections;

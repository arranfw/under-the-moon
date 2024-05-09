"use client";

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
    4: "#bc70c4"
  }[difficulty];
};

const useGame = (options: Options) => {
  const initialState: State = {
    incomplete: options.groups,
    complete: [],
    items: shuffle(options.groups.flatMap((g) => g.items)),
    activeItems: [],
    mistakesRemaining: 3
  };
  const [game, setGame] = useState(initialState);

  const toggleActive = (item: string) => {
    if (game.activeItems.includes(item)) {
      setGame((prev) => ({
        ...game,
        activeItems: prev.activeItems.filter((i) => i !== item)
      }));
    } else if (game.activeItems.length < 4) {
      setGame((prev) => ({
        ...game,
        activeItems: [...prev.activeItems, item]
      }));
    }
  };

  const shuffleGame = () => {
    setGame((prev) => ({
      ...game,
      items: shuffle(game.items)
    }));
  };

  const deselectAll = () => {
    setGame((prev) => ({
      ...game,
      activeItems: []
    }));
  };

  const submit = () => {
    const foundGroup = game.incomplete.find((group) =>
      group.items.every((item) => game.activeItems.includes(item))
    );

    if (foundGroup) {
      // game.complete.push(foundGroup);
      const incomplete = game.incomplete.filter(
        (group) => group !== foundGroup
      );
      setGame((prev) => ({
        ...game,
        complete: [...prev.complete, foundGroup],
        incomplete: [...incomplete],
        items: incomplete.flatMap((group) => group.items),
        activeItems: []
      }));
      // game.incomplete = incomplete;
      // game.items = incomplete.flatMap((group) => group.items);
      // game.activeItems = [];
    } else {
      setGame((prev) => ({
        ...game,
        mistakesRemaining: prev.mistakesRemaining - 1,
        activeItems: []
      }));
      // game.mistakesRemaining -= 1;
      // game.activeItems = [];

      if (game.mistakesRemaining === 0) {
        setGame((prev) => ({
          ...game,
          complete: [...prev.incomplete],
          incomplete: [],
          items: [],
          activeItems: []
        }));
        // game.complete = [...game.incomplete];
        // game.incomplete = [];
        // game.items = [];
      }
    }
  };

  return {
    toggleActive,
    shuffleGame,
    deselectAll,
    submit,
    game
  };
};

const Connections = () => {
  const { game, deselectAll, shuffleGame, submit, toggleActive } = useGame({
    groups: DAY_1
  });

  return (
    <div className="h-full bg-white">
      <div>
        <div>
          <h1>Connections</h1>
          <p>Create four groups of four!</p>
          <div>
            {game.complete.map((group) => (
              <div>
                <p>{group.category}</p>
                <p>{group.items.join(", ")}</p>
              </div>
            ))}

            {chunk(game.items, 4).map((row) => (
              <>
                <div>
                  {row.map((item) => (
                    <button
                      onClick={() => toggleActive(item)}
                      className={cn("border", {
                        "bg-white": game.activeItems.includes(item),
                        "bg-gray-300": !game.activeItems.includes(item)
                      })}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            ))}
          </div>
          <div>
            <p>Mistakes remaining:</p>
            {[...Array(game.mistakesRemaining).keys()].map(() => (
              <div className="rounded-full" />
            ))}
          </div>
          <div>
            <button onClick={shuffleGame}>Shuffle</button>
            <button onClick={deselectAll}>Deselect All</button>
            <button disabled={game.activeItems.length !== 4} onClick={submit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;

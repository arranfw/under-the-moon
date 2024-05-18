"use client";

import { cn } from "@/util";
import React, { useState } from "react";
import lodashShuffle from "lodash/shuffle";
import { ConnectionsActionButton } from "@/components/ConnectionsActionButton";
import { Category } from "@/util/api/connections";
import { intersection } from "lodash";
import { ConnectionsItem } from "./ConnectionsItem";
import { useLocalStorage } from "@uidotdev/usehooks";

interface GameState {
  selected: string[];
  correctGuesses: string[];
  incorrectGuesses: string[][];
  completedGroups: Category[];
  grid: string[];
}

interface ConnectionsGameProps {
  gameGrid: string[];
  categories: Category[];
  date: string;
}

export const ConnectionsGame: React.FC<ConnectionsGameProps> = ({
  gameGrid,
  categories,
  date,
}) => {
  const initialGameState = {
    selected: [],
    correctGuesses: [],
    incorrectGuesses: [],
    completedGroups: [],
    grid: gameGrid,
  };

  const [
    { completedGroups, correctGuesses, incorrectGuesses, selected, grid },
    setGameState,
  ] = useLocalStorage<GameState>(
    `connections-game-state-${date}`,
    initialGameState,
  );
  const numberOfCorrectGuesses = correctGuesses.length;
  const [jigglingItems, setJigglingItems] = useState<string[]>([]);

  const shuffle = () => {
    setGameState((prev) => ({
      ...prev,
      grid: [
        ...prev.grid.slice(0, numberOfCorrectGuesses),
        ...lodashShuffle(prev.grid.slice(numberOfCorrectGuesses)),
      ],
    }));
  };

  const isCorrectGuess = () =>
    categories.some(
      (category) =>
        intersection(
          category.cards.map((card) => card.content),
          selected,
        ).length === 4,
    );

  const submit = () => {
    const currentGuess = [...selected];
    const isCorrect = isCorrectGuess();
    if (!isCorrect) {
      setGameState((prev) => ({
        ...prev,
        incorrectGuesses: [...prev.incorrectGuesses, currentGuess],
      }));
      setJigglingItems(currentGuess);
      setTimeout(() => {
        setJigglingItems([]);
      }, 1000);
      return;
    }

    if (currentGuess.length !== 4) {
      return;
    }
    const reorderedGrid = [
      ...correctGuesses,
      ...currentGuess,
      ...grid.filter(
        (l) => !currentGuess.includes(l) && !correctGuesses.includes(l),
      ),
    ];
    setGameState((prev) => ({
      ...prev,
      selected: [],
      correctGuesses: [...prev.correctGuesses, ...currentGuess],
      grid: reorderedGrid,
    }));
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        grid: reorderedGrid,
        completedGroups: [
          ...prev.completedGroups,
          categories.find(
            (category) =>
              intersection(
                category.cards.map((card) => card.content),
                currentGuess,
              ).length === 4,
          )!,
        ],
      }));
    }, 600);
  };

  const handleDeselectAll = () => {
    setGameState((prev) => ({
      ...prev,
      selected: [],
    }));
  };

  const handleSelect = (label: string) => {
    setGameState((prev) => {
      if (prev.selected.includes(label)) {
        return {
          ...prev,
          selected: prev.selected.filter((l) => l !== label),
        };
      }
      if (prev.correctGuesses.includes(label)) {
        return prev;
      }
      if (prev.selected.length === 4) {
        return prev;
      }
      return {
        ...prev,
        selected: [...prev.selected, label],
      };
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-96 h-96">
        {gameGrid.map((label) => (
          <ConnectionsItem
            onClick={handleSelect}
            key={label}
            col={grid.indexOf(label) % 4}
            row={Math.floor(grid.indexOf(label) / 4)}
            label={label}
            selected={selected.includes(label)}
            completed={correctGuesses.includes(label)}
            jiggle={jigglingItems.includes(label)}
          />
        ))}

        {completedGroups.map((category) => (
          <div
            key={category.title}
            className={cn(
              `w-full p-1 uppercase h-1/4 animate-fadeIn animate-popIn`,
            )}
          >
            <div
              className={cn(
                "flex flex-col justify-center items-center relative z-10",
                "h-full w-full rounded-md color-black tracking-wider text-black dark:text-white",
                {
                  "bg-connections-difficulty-1 dark:bg-connections-difficulty-1-dark":
                    category.difficulty === 0,
                  "bg-connections-difficulty-2 dark:bg-connections-difficulty-2-dark":
                    category.difficulty === 1,
                  "bg-connections-difficulty-3 dark:bg-connections-difficulty-3-dark":
                    category.difficulty === 2,
                  "bg-connections-difficulty-4 dark:bg-connections-difficulty-4-dark":
                    category.difficulty === 3,
                },
              )}
            >
              <p className="font-bold">{category.title}</p>
              <p>{category.cards.map((card) => card.content).join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <p>Mistakes remaining:</p>
        <div className="flex gap-2">
          {Array(4)
            .fill("")
            .map((_, i) => (
              <div
                key={i}
                className={cn("rounded-full w-4 h-4", {
                  "bg-transparent": i >= Math.abs(incorrectGuesses.length - 4),
                  "bg-connections-button-active dark:bg-white":
                    i < Math.abs(incorrectGuesses.length - 4),
                })}
              />
            ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 w-full">
        <ConnectionsActionButton onClick={shuffle}>
          Shuffle
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={handleDeselectAll}
          disabled={selected.length === 0}
        >
          Deselect All
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={submit}
          disabled={selected.length !== 4 || jigglingItems.length !== 0}
        >
          Submit
        </ConnectionsActionButton>
      </div>
    </div>
  );
};

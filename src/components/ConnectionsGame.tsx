"use client";

import { cn } from "@/util";
import React, { useState } from "react";
import lodashShuffle from "lodash/shuffle";
import { ConnectionsActionButton } from "@/components/ConnectionsActionButton";
import { Category, ConnectionsGameData } from "@/util/api/connections";
import { flatMap, intersection, sortBy } from "lodash";
import { ConnectionsItem } from "./ConnectionsItem";

const gameDataToGrid = (gameData: ConnectionsGameData) => {
  const cards = flatMap(gameData.categories, (category) => category.cards);
  return sortBy(cards, "position").map((card) => card.content);
};

interface GameState {
  selected: string[];
  correctGuesses: string[];
  incorrectGuesses: string[][];
  completedGroups: Category[];
}

const initialGameState: GameState = {
  selected: [],
  correctGuesses: [],
  incorrectGuesses: [],
  completedGroups: [],
};

interface ConnectionsGameProps {
  gameData: ConnectionsGameData;
}

export const ConnectionsGame: React.FC<ConnectionsGameProps> = ({
  gameData,
}) => {
  const originalGrid = gameDataToGrid(gameData);
  const [
    { completedGroups, correctGuesses, incorrectGuesses, selected },
    setGameState,
  ] = useState<GameState>(initialGameState);
  const [grid, setGrid] = useState(gameDataToGrid(gameData));
  const numberOfCorrectGuesses = correctGuesses.length;
  const [jigglingIncorrect, setJigglingIncorrect] = useState<string[]>([]);

  const promoteLabels = (labels: string[]) => {
    setGrid((prev) => [
      ...correctGuesses,
      ...labels,
      ...prev.filter((l) => !labels.includes(l) && !correctGuesses.includes(l)),
    ]);
  };

  const shuffle = () => {
    setGrid((prev) => [
      ...prev.slice(0, numberOfCorrectGuesses),
      ...lodashShuffle(prev.slice(numberOfCorrectGuesses)),
    ]);
  };

  const isCorrectGuess = () =>
    gameData.categories.some(
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
      setJigglingIncorrect(currentGuess);
      setTimeout(() => {
        setJigglingIncorrect([]);
      }, 1000);
      return;
    }

    if (currentGuess.length !== 4) {
      return;
    }
    promoteLabels(currentGuess);
    setGameState((prev) => ({
      ...prev,
      selected: [],
      correctGuesses: [...prev.correctGuesses, ...currentGuess],
    }));
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        completedGroups: [
          ...prev.completedGroups,
          gameData.categories.find(
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
      if (correctGuesses.includes(label)) {
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
        {originalGrid.map((label, i) => (
          <ConnectionsItem
            onClick={handleSelect}
            key={label}
            col={grid.indexOf(label) % 4}
            row={Math.floor(grid.indexOf(label) / 4)}
            label={label}
            selected={selected.includes(label)}
            completed={correctGuesses.includes(label)}
            jiggle={jigglingIncorrect.includes(label)}
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
          disabled={selected.length !== 4 || jigglingIncorrect.length !== 0}
        >
          Submit
        </ConnectionsActionButton>
      </div>
    </div>
  );
};

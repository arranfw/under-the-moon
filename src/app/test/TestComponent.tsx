"use client";

import { cn } from "@/util";
import React, { useState } from "react";
import lodashShuffle from "lodash/shuffle";
import { ConnectionsActionButton } from "@/components/ConnectionsActionButton";
import { Category, ConnectionsData } from "@/util/api/connections";
import { flatMap, intersection, sortBy } from "lodash";

interface TestItemProps {
  onClick: (label: string) => void;
  col: number;
  row: number;
  label: string;
  selected?: boolean;
  completed?: boolean;
  jiggle?: boolean;
}

export const TestItem: React.FC<TestItemProps> = ({
  col,
  row,
  label,
  onClick,
  selected,
  completed,
  jiggle,
}) => {
  return (
    <div
      className={cn(
        "p-1 box-border transition-all duration-700",
        `absolute w-[25%] h-[25%]`,
        `top-[${(row * 25).toFixed(0)}%] left-[${(col * 25).toFixed(0)}%]`,
      )}
    >
      <button
        onClick={() => onClick(label)}
        className={cn(
          "w-full h-full grid place-content-center z-0",
          "rounded-md uppercase text-xs font-bold select-none",
          {
            "bg-stone-200 dark:bg-gray-800": !selected,
            "text-black dark:text-gray-300": !selected,
            "scale-100": !selected,
            "bg-connections-button-active": selected,
            "text-connections-button-active": selected,
            "scale-105": selected,
            "animate-wiggle": jiggle,
            "cursor-default": completed,
          },
        )}
      >
        {label}
      </button>
    </div>
  );
};

const initialGrid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

interface TestComponentProps {
  gameData: ConnectionsData;
}

const gameDataToGrid = (gameData: ConnectionsData) => {
  const cards = flatMap(gameData.categories, (category) => category.cards);
  return sortBy(cards, "position").map((card) => card.content);
};

export const TestComponent: React.FC<TestComponentProps> = ({ gameData }) => {
  const originalGrid = gameDataToGrid(gameData);
  const [grid, setGrid] = useState(gameDataToGrid(gameData));
  const [selected, setSelected] = useState<string[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[][]>([]);
  const numberOfCorrectGuesses = correctGuesses.length;
  const [jigglingIncorrect, setJigglingIncorrect] = useState<string[]>([]);
  const [completedGroups, setCompletedGroups] = useState<Category[]>([]);

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
      setJigglingIncorrect(currentGuess);
      setIncorrectGuesses((prev) => [...prev, currentGuess]);
      setTimeout(() => {
        setJigglingIncorrect([]);
      }, 1000);
      return;
    }

    if (currentGuess.length !== 4) {
      return;
    }
    promoteLabels(currentGuess);
    setSelected([]);
    setCorrectGuesses((prev) => [...prev, ...currentGuess]);
    setTimeout(() => {
      setCompletedGroups((prev) => [
        ...prev,
        gameData.categories.find(
          (category) =>
            intersection(
              category.cards.map((card) => card.content),
              currentGuess,
            ).length === 4,
        )!,
      ]);
    }, 600);
  };

  const handleDeselectAll = () => {
    setSelected([]);
  };

  const handleSelect = (label: string) => {
    setSelected((prev) => {
      if (prev.includes(label)) {
        return prev.filter((l) => l !== label);
      }
      if (correctGuesses.includes(label)) {
        return prev;
      }
      if (prev.length === 4) {
        return prev;
      }
      return [...prev, label];
    });
  };

  console.log(completedGroups);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-96 h-96">
        {originalGrid.map((label, i) => (
          <TestItem
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

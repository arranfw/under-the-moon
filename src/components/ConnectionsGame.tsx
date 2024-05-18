"use client";

import { cn } from "@/util";
import React, { useState } from "react";
import lodashShuffle from "lodash/shuffle";
import { ConnectionsActionButton } from "@/components/ConnectionsActionButton";
import { Category } from "@/util/api/connections";
import { intersection } from "lodash";
import { ConnectionsItem } from "./ConnectionsItem";
import { useLocalStorage } from "usehooks-ts";

const guessMultiplier = [1.771561, 1.61051, 1.4641, 1.331, 1.21, 1.1, 1];
const difficultyMultiplier = [2, 8, 16, 34];

interface GameState {
  selected: string[];
  correctGuesses: string[];
  incorrectGuesses: string[][];
  completedGroups: Category[];
  grid: string[];
  score: number;
  guessCount: number;
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
  const initialGameState: GameState = {
    selected: [],
    correctGuesses: [],
    incorrectGuesses: [],
    completedGroups: [],
    score: 0,
    grid: gameGrid,
    guessCount: 0,
  };

  const [
    {
      completedGroups,
      correctGuesses,
      incorrectGuesses,
      selected,
      grid,
      score,
      guessCount,
    },
    setGameState,
  ] = useLocalStorage<GameState>(
    `connections-game-state-${date}`,
    initialGameState,
    { initializeWithValue: false },
  );
  const numberOfCorrectGuesses = correctGuesses.length;
  const [jigglingIncorrectItems, setJigglingIncorrectItems] = useState<
    string[]
  >([]);
  const [jigglingCorrectItems, setJigglingCorrectItems] = useState<string[]>(
    [],
  );

  const shuffle = () => {
    setGameState((prev) => ({
      ...prev,
      grid: [
        ...prev.grid.slice(0, numberOfCorrectGuesses),
        ...lodashShuffle(prev.grid.slice(numberOfCorrectGuesses)),
      ],
    }));
  };

  const getCorrectGuessCount = () => {
    for (const category of categories) {
      const correctCount = intersection(
        category.cards.map((card) => card.content),
        selected,
      ).length;

      if (correctCount > 2) {
        return correctCount;
      }
    }
  };

  const getWasPreviouslyGuessed = () => {
    return incorrectGuesses.some(
      (incorrectGuess) => intersection(incorrectGuess, selected).length === 4,
    );
  };

  const submit = async () => {
    const currentGuess = [...selected];
    const correctGuessCount = getCorrectGuessCount();
    const isCorrect = correctGuessCount === 4;
    const wasPreviouslyGuessed = getWasPreviouslyGuessed();

    if (wasPreviouslyGuessed) {
      window.alert("Already guessed!");
      return;
    }

    if (correctGuessCount === 3) {
      window.alert("One away...");
    }

    if (!isCorrect) {
      setGameState((prev) => ({
        ...prev,
        incorrectGuesses: [...prev.incorrectGuesses, currentGuess],
        guessCount: prev.guessCount + 1,
      }));
      setJigglingIncorrectItems(currentGuess);
      setTimeout(() => {
        setJigglingIncorrectItems([]);
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
    const completedGroup = categories.find(
      (category) =>
        intersection(
          category.cards.map((card) => card.content),
          currentGuess,
        ).length === 4,
    );
    setTimeout(() => {
      setJigglingCorrectItems([currentGuess[0]]);
    }, 0);
    setTimeout(() => {
      setJigglingCorrectItems((prev) => [...prev, currentGuess[1]]);
    }, 300);
    setTimeout(() => {
      setJigglingCorrectItems((prev) => [...prev, currentGuess[2]]);
    }, 600);
    setTimeout(() => {
      setJigglingCorrectItems((prev) => [...prev, currentGuess[3]]);
    }, 900);
    setTimeout(() => {
      setJigglingCorrectItems([]);
    }, 1200);
    await new Promise((resolve) => setTimeout(resolve, 1300));
    setGameState((prev) => ({
      ...prev,
      correctGuesses: [...prev.correctGuesses, ...currentGuess],
      guessCount: prev.guessCount + 1,
      grid: reorderedGrid,
      score:
        prev.score +
        guessMultiplier[prev.guessCount] *
          difficultyMultiplier[completedGroup?.difficulty || 0],
    }));
    setTimeout(() => {
      setGameState((prev) => {
        return {
          ...prev,
          selected: [],
          grid: reorderedGrid,
          completedGroups: [...prev.completedGroups, completedGroup!],
        };
      });
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

  const gameComplete =
    completedGroups.length === categories.length ||
    incorrectGuesses.length === 4;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full aspect-square">
        {!gameComplete &&
          gameGrid.map((label) => (
            <ConnectionsItem
              onClick={handleSelect}
              key={label}
              col={grid.indexOf(label) % 4}
              row={Math.floor(grid.indexOf(label) / 4)}
              label={label}
              selected={selected.includes(label)}
              completed={correctGuesses.includes(label)}
              jiggleIncorrect={jigglingIncorrectItems.includes(label)}
              jiggleCorrect={jigglingCorrectItems.includes(label)}
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

        {gameComplete && (
          <div
            className={cn(
              "h-[12.5%] rounded-md m-1 flex flex-col items-center justify-center",
              "bg-gray-200 dark:bg-gray-800 text-black dark:text-white",
              "animate-slideDown",
            )}
          >
            <p className="tracking-wider">
              <span className="font-bold">{Math.round(score)}</span> points in{" "}
              <span className="font-bold">{guessCount}</span> guesses
            </p>
          </div>
        )}
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

      <div
        className={cn(
          "flex justify-center gap-2 w-full transition-opacity duration-300",
          {
            "opacity-0": gameComplete,
          },
        )}
      >
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
          disabled={
            selected.length !== 4 || jigglingIncorrectItems.length !== 0
          }
        >
          Submit
        </ConnectionsActionButton>
      </div>
    </div>
  );
};

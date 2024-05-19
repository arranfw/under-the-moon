"use client";

import { cn } from "@/util";
import React, { useRef, useState } from "react";
import lodashShuffle from "lodash/shuffle";
import { ConnectionsActionButton } from "@/components/ConnectionsActionButton";
import { Category } from "@/util/api/connections";
import { flatMap, intersection } from "lodash";
import { ConnectionsItem } from "./ConnectionsItem";
import { useLocalStorage } from "usehooks-ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";

const guessMultiplier = [1.771561, 1.61051, 1.4641, 1.331, 1.21, 1.1, 1];
const difficultyMultiplier = [2, 8, 16, 34];
const difficultyEmojiMap = ["🟨", "🟩", "🟦", "🟪"];
interface GameState {
  selected: string[];
  correctGuesses: string[];
  incorrectGuesses: string[][];
  completedGroups: Category[];
  grid: string[];
  score: number;
  guessCount: number;
  hintsUsed?: number;
  markedItems?: { label: string; difficulty: number }[];
  gameSummary?: number[][];
}

interface ConnectionsGameProps {
  gameGrid: string[];
  categories: Category[];
  date: string;
  gameNumber: number;
}

export const ConnectionsGame: React.FC<ConnectionsGameProps> = ({
  gameGrid,
  categories,
  date,
  gameNumber,
}) => {
  const initialGameState: GameState = {
    selected: [],
    correctGuesses: [],
    incorrectGuesses: [],
    completedGroups: [],
    score: 0,
    grid: gameGrid,
    guessCount: 0,
    markedItems: [],
    hintsUsed: 0,
    gameSummary: [],
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
      markedItems,
      hintsUsed,
      gameSummary,
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

  const gameCompletedRef = useRef<HTMLDivElement>(null);

  const handleShuffleClick = () => {
    setGameState((prev) => ({
      ...prev,
      grid: [
        ...prev.grid.slice(0, numberOfCorrectGuesses),
        ...lodashShuffle(prev.grid.slice(numberOfCorrectGuesses)),
      ],
    }));
  };

  const handleHintClick = () => {
    const hintCategory = categories.find(
      (category) =>
        !completedGroups.some((completedGroup) =>
          completedGroup.title.includes(category.title),
        ),
    );

    if (hintCategory) {
      setJigglingCorrectItems(
        hintCategory.cards.map((card) => card.content).slice(0, 2),
      );
    }

    setGameState((prev) => ({
      ...prev,
      score: prev.score - 10,
      hintsUsed: prev.hintsUsed || 0 + 1,
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

    const fullGuess = currentGuess.map(
      (guess) =>
        categories.find((category) =>
          category.cards.map((card) => card.content).includes(guess),
        )?.difficulty!,
    );
    setGameState((prev) => ({
      ...prev,
      gameSummary: [...(prev.gameSummary || []), fullGuess],
    }));

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

  const handleUnmarkAll = () => {
    setGameState((prev) => ({
      ...prev,
      markedItems: [],
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

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      gameCompletedRef.current?.innerText.replaceAll("\n\n", "\n") || "",
    );
  };

  const handleMarkItem = (label: string, difficulty: number | null) => {
    if (difficulty === null) {
      setGameState((prev) => ({
        ...prev,
        markedItems: prev.markedItems?.filter((item) => item.label !== label),
      }));
      return;
    }
    if (markedItems?.some((item) => item.label === label)) {
      setGameState((prev) => ({
        ...prev,
        markedItems: prev.markedItems?.map((item) => {
          if (item.label === label) {
            return { label, difficulty };
          }
          return item;
        }),
      }));
      return;
    }
    setGameState((prev) => ({
      ...prev,
      markedItems: [...(prev.markedItems || []), { label, difficulty }],
    }));
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
              onMarkItem={handleMarkItem}
              key={label}
              col={grid.indexOf(label) % 4}
              row={Math.floor(grid.indexOf(label) / 4)}
              label={label}
              selected={selected.includes(label)}
              completed={correctGuesses.includes(label)}
              jiggleIncorrect={jigglingIncorrectItems.includes(label)}
              jiggleCorrect={jigglingCorrectItems.includes(label)}
              difficultyMark={
                markedItems?.find((item) => item.label === label)?.difficulty
              }
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
              data-difficulty={category.difficulty}
              className={cn(
                "flex flex-col justify-center items-center relative z-10",
                "h-full w-full rounded-md color-black tracking-wider text-black dark:text-white",
                {
                  "bg-connections-difficulty-0 dark:bg-connections-difficulty-0-dark":
                    category.difficulty === 0,
                  "bg-connections-difficulty-1 dark:bg-connections-difficulty-1-dark":
                    category.difficulty === 1,
                  "bg-connections-difficulty-2 dark:bg-connections-difficulty-2-dark":
                    category.difficulty === 2,
                  "bg-connections-difficulty-3 dark:bg-connections-difficulty-3-dark":
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
            ref={gameCompletedRef}
            className={cn(
              "rounded-md m-1 p-2 flex flex-col items-center justify-center relative",
              "bg-gray-200 dark:bg-gray-800 text-black dark:text-white",
              "animate-slideDown",
            )}
          >
            <button
              className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-gray-300"
              onClick={handleCopySummary}
            >
              <FontAwesomeIcon icon={faClipboard} className="h-full w-full" />
            </button>
            <p>Connections</p>
            <p>Puzzle #{gameNumber}</p>{" "}
            {gameSummary && (
              <div className="mb-2">
                {gameSummary.map((category, i) => (
                  <p key={`${i}`}>
                    {category.map((summaryItem, j) => (
                      <span>{difficultyEmojiMap[summaryItem]}</span>
                    ))}
                  </p>
                ))}
              </div>
            )}
            <p className="tracking-wider">
              <span className="font-bold">
                {Math.round(score) === 100 ? "💯" : Math.round(score)}
              </span>{" "}
              points in <span className="font-bold">{guessCount}</span> guesses
              with <span className="font-bold">{hintsUsed}</span> hint
              {hintsUsed !== 1 && "s"}
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
          "flex flex-wrap justify-center gap-2 w-full transition-opacity duration-300",
          {
            hidden: gameComplete,
          },
        )}
      >
        <ConnectionsActionButton onClick={handleShuffleClick}>
          Shuffle
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={handleHintClick}
          disabled={selected.length !== 0}
        >
          Hint (-10pts)
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={handleDeselectAll}
          disabled={selected.length === 0}
        >
          Deselect All
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={handleUnmarkAll}
          disabled={markedItems?.length === 0}
        >
          Unmark All
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

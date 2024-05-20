"use client";

import { cn } from "@/util";
import React, { useState } from "react";
import lodashShuffle from "lodash/shuffle";
import { ConnectionsActionButton } from "@/components/connections/ActionButton";
import { Category } from "@/util/api/connections";
import { intersection } from "lodash";
import { ConnectionsItem } from "./Item";
import { useLocalStorage } from "usehooks-ts";
import { CompletedGroup } from "./CompletedGroup";
import { GameSummary } from "./GameSummary";
import { difficultyMultiplier, guessMultiplier } from "./util";
import { MistakesRemaining } from "./MistakesRemaining";

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
  const [hintedItems, setHintedItems] = useState<string[]>([]);

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
      setHintedItems(
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

    if (currentGuess.length !== 4) {
      return;
    }

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
    setHintedItems([]);
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
              hinting={hintedItems.includes(label) && !selected.includes(label)}
            />
          ))}

        {completedGroups.map((category) => (
          <CompletedGroup category={category} />
        ))}

        {gameComplete && (
          <GameSummary
            gameNumber={gameNumber}
            gameSummary={gameSummary}
            guessCount={guessCount}
            score={score}
            hintsUsed={hintsUsed}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <p>Mistakes remaining:</p>
        <MistakesRemaining incorrectGuessCount={incorrectGuesses.length} />
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
          disabled={selected.length !== 0 || hintedItems.length !== 0}
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

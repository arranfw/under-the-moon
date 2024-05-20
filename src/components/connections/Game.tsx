"use client";

import { cn } from "@/util";
import React, { useReducer, useState } from "react";
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
import {
  GameActionType,
  GameState,
  gameStateReducer,
} from "./gameStateReducer";

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
    hintedItems: [],
  };

  const [
    {
      completedGroups,
      correctGuesses,
      incorrectGuesses,
      selected,
      score,
      guessCount,
      markedItems,
      hintsUsed,
      gameSummary,
      grid,
      hintedItems,
    },
    gameDispatch,
  ] = useReducer(gameStateReducer, initialGameState);

  const [jigglingIncorrectItems, setJigglingIncorrectItems] = useState<
    string[]
  >([]);
  const [jigglingCorrectItems, setJigglingCorrectItems] = useState<string[]>(
    [],
  );

  const handleShuffleClick = () => {
    gameDispatch({ type: GameActionType.SHUFFLE });
  };

  const handleHintClick = () => {
    const hintCategory = categories.find(
      (category) =>
        !completedGroups.some((completedGroup) =>
          completedGroup.title.includes(category.title),
        ),
    );

    gameDispatch({
      type: GameActionType.USE_HINT,
      payload:
        hintCategory?.cards.map((card) => card.content).slice(0, 2) || [],
    });
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

    gameDispatch({
      type: GameActionType.PUSH_GAME_SUMMARY,
      payload: fullGuess,
    });

    if (correctGuessCount === 3) {
      window.alert("One away...");
    }

    if (!isCorrect) {
      gameDispatch({
        type: GameActionType.PUSH_INCORRECT_GUESS,
        payload: currentGuess,
      });
      setJigglingIncorrectItems(currentGuess);
      setTimeout(() => {
        setJigglingIncorrectItems([]);
      }, 1000);
      return;
    }

    currentGuess.forEach((guess, i) => {
      setTimeout(() => {
        setJigglingCorrectItems((prev) => [...prev, guess]);
      }, i * 300);
    });
    setTimeout(() => {
      setJigglingCorrectItems([]);
    }, 1200);

    await new Promise((resolve) => setTimeout(resolve, 1300));

    const completedGroup = categories.find(
      (category) =>
        intersection(
          category.cards.map((card) => card.content),
          currentGuess,
        ).length === 4,
    );

    gameDispatch({
      type: GameActionType.PUSH_CORRECT_GUESS,
      payload: currentGuess,
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (completedGroup) {
      gameDispatch({
        type: GameActionType.PUSH_POST_CORRECT_GUESS,
        payload: completedGroup,
      });
    }
  };

  const handleDeselectAll = () => {
    gameDispatch({ type: GameActionType.DESELECT_ALL });
  };

  const handleUnmarkAll = () => {
    gameDispatch({ type: GameActionType.UNMARK_ALL });
  };

  const handleSelect = (label: string) => {
    gameDispatch({ type: GameActionType.SELECT_ITEM, payload: label });
  };

  const handleMarkItem = (label: string, difficulty: number | null) => {
    gameDispatch({
      type: GameActionType.MARK_ITEM,
      payload: { label, difficulty },
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
              hinting={
                hintedItems?.includes(label) && !selected.includes(label)
              }
            />
          ))}

        {completedGroups.map((category) => (
          <CompletedGroup key={category.title} category={category} />
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
          disabled={selected.length !== 0 || hintedItems?.length !== 0}
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

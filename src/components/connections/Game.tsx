"use client";

import React, { useEffect, useReducer, useState } from "react";

import { ConnectionsActionButton } from "@/components/connections/ActionButton";
import { ConnectionsResults, NewConnectionsResults } from "@/db/types";
import { cn } from "@/util";
import { Category } from "@/util/api/connections";

import { CompletedGroup } from "./CompletedGroup";
import {
  GameActionType,
  GameState,
  gameStateReducer,
} from "./gameStateReducer";
import { GameSummary } from "./GameSummary";
import { ConnectionsItem } from "./Item";
import { MistakesRemaining } from "./MistakesRemaining";
import { gameDateToGameNumber } from "./util";
import { LocalDate } from "@js-joda/core";
import { intersection, isEmpty } from "lodash";

const JIGGLE_CORRECT_DURATION = 300;
const JIGGLE_ALL_CORRECT_DURATION = JIGGLE_CORRECT_DURATION * 4;
const JIGGLE_ALL_INCORRECT_DURATION = 1000;
const GRID_REARRANGE_DURATION = 600;

interface ConnectionsGameProps {
  gameGrid: string[];
  categories: Category[];
  date: string;
  userResult: ConnectionsResults | undefined | null;
  createConnectionsResult: (
    result: Omit<NewConnectionsResults, "userId">,
  ) => Promise<ConnectionsResults | undefined>;
}

export const ConnectionsGame: React.FC<ConnectionsGameProps> = ({
  gameGrid,
  categories,
  date,
  userResult,
  createConnectionsResult,
}) => {
  const today = LocalDate.now();
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const initialGameState: GameState = {
    date,
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

  const gameNumber = gameDateToGameNumber(date);

  useEffect(() => {
    // pull game state from database if it exists, otherwise load from local storage
    if (userResult && userResult.date === today.toJSON()) {
      gameDispatch({
        type: GameActionType.LOAD_STATE,

        payload: {
          date,

          correctGuesses,
          incorrectGuesses,
          selected,
          markedItems,
          grid,
          hintedItems,

          completedGroups: categories,
          guessCount: userResult.guessCount,
          gameSummary: userResult.summary,
          hintsUsed: userResult.hintCount,
          score: userResult.score,
        },
      });
    } else {
      const savedState = JSON.parse(
        localStorage.getItem(`connections-game-state-${date}`) || "{}",
      );
      if (!isEmpty(savedState)) {
        gameDispatch({ type: GameActionType.LOAD_STATE, payload: savedState });
      }
    }
  }, [gameComplete, userResult]);

  useEffect(() => {
    if (
      completedGroups.length === categories.length ||
      incorrectGuesses.length === 4
    ) {
      setGameComplete(true);
    }
  }, [completedGroups, categories]);

  useEffect(() => {
    if (gameComplete && !userResult) {
      createConnectionsResult({
        date,
        score: Math.round(score),
        summary: gameSummary || [],
        hintCount: hintsUsed || 0,
        gameNumber,
        guessCount: guessCount || 0,
      });
    }
  }, [gameComplete]);

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

  const getCorrectGuessCount = (guess: string[]) => {
    for (const category of categories) {
      const correctCount = intersection(
        category.cards.map((card) => card.content),
        guess,
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

  const autoCompleteGame = async () => {
    setIsAutoCompleting(true);
    const incompleteGroups = categories.filter(
      (category) =>
        completedGroups.some(
          (completedGroup) => completedGroup.title === category.title,
        ) === false,
    );

    for (const group of incompleteGroups) {
      await submit({
        guess: group.cards.map((card) => card.content),
        isPlayerGuess: false,
      });
      await new Promise((resolve) => setTimeout(resolve, 300)); // pause between submissions
    }
    setGameComplete(true);
  };

  const submit = async ({
    guess,
    isPlayerGuess = true,
  }: {
    guess: string[];
    isPlayerGuess?: boolean;
  }) => {
    const correctGuessCount = getCorrectGuessCount(guess);
    const isCorrect = correctGuessCount === 4;
    const wasPreviouslyGuessed = getWasPreviouslyGuessed();

    if (guess.length !== 4) {
      return;
    }

    if (wasPreviouslyGuessed) {
      window.alert("Already guessed!");
      return;
    }

    const fullGuess = guess.map(
      (guess) =>
        categories.find((category) =>
          category.cards.map((card) => card.content).includes(guess),
        )?.difficulty!,
    );

    if (isPlayerGuess) {
      gameDispatch({
        type: GameActionType.PUSH_GAME_SUMMARY,
        payload: fullGuess,
      });
    }

    if (correctGuessCount === 3) {
      window.alert("One away...");
    }

    if (!isCorrect) {
      gameDispatch({
        type: GameActionType.PUSH_INCORRECT_GUESS,
        payload: guess,
      });
      setJigglingIncorrectItems(guess);
      await new Promise((resolve) =>
        setTimeout(() => {
          setJigglingIncorrectItems([]);
          resolve(0);
        }, JIGGLE_ALL_INCORRECT_DURATION),
      );

      if (incorrectGuesses.length >= 3) {
        await autoCompleteGame();
      }
      return;
    }

    guess.forEach((guess, i) => {
      setTimeout(() => {
        setJigglingCorrectItems((prev) => [...prev, guess]);
      }, i * JIGGLE_CORRECT_DURATION);
    });

    setTimeout(() => {
      setJigglingCorrectItems([]);
    }, JIGGLE_ALL_CORRECT_DURATION);

    await new Promise((resolve) =>
      setTimeout(resolve, JIGGLE_ALL_CORRECT_DURATION + 100),
    );

    const completedGroup = categories.find(
      (category) =>
        intersection(
          category.cards.map((card) => card.content),
          guess,
        ).length === 4,
    );

    gameDispatch({
      type: GameActionType.PUSH_CORRECT_GUESS,
      payload: guess,
    });
    await new Promise((resolve) =>
      setTimeout(resolve, GRID_REARRANGE_DURATION),
    );
    if (completedGroup) {
      gameDispatch({
        type: GameActionType.PUSH_POST_CORRECT_GUESS,
        payload: {
          category: completedGroup,
          isPlayerGuess: isPlayerGuess,
        },
      });
    }
    if (completedGroups.length === 4) {
      setGameComplete(true);
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

  return (
    <div className="flex flex-col w-full items-center gap-4">
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
      </div>
      <div className="w-full">
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
      <div className={cn("flex items-center gap-2", { hidden: gameComplete })}>
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
        <ConnectionsActionButton
          onClick={handleShuffleClick}
          disabled={isAutoCompleting}
        >
          Shuffle
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={handleHintClick}
          disabled={
            selected.length !== 0 ||
            hintedItems?.length !== 0 ||
            isAutoCompleting
          }
        >
          Hint (-10pts)
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={handleDeselectAll}
          disabled={selected.length === 0 || isAutoCompleting}
        >
          Deselect All
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={handleUnmarkAll}
          disabled={markedItems?.length === 0 || isAutoCompleting}
        >
          Unmark All
        </ConnectionsActionButton>
        <ConnectionsActionButton
          onClick={() => submit({ guess: selected })}
          disabled={
            selected.length !== 4 ||
            jigglingIncorrectItems.length !== 0 ||
            isAutoCompleting
          }
        >
          Submit
        </ConnectionsActionButton>
      </div>
    </div>
  );
};

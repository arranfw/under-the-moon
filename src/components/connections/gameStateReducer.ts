import { Category } from "@/util/api/connections";

import { difficultyMultiplier, guessMultiplier } from "./util";
import { groupBy, partition, shuffle } from "lodash";

export interface GameState {
  date: string;
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
  hintedItems?: string[];
}

export enum GameActionType {
  SHUFFLE = "SHUFFLE",
  USE_HINT = "USE_HINT",
  DESELECT_ALL = "DESELECT_ALL",
  UNMARK_ALL = "UNMARK_ALL",
  SELECT_ITEM = "SELECT_ITEM",
  MARK_ITEM = "MARK_ITEM",
  PUSH_GAME_SUMMARY = "PUSH_GAME_SUMMARY",
  PUSH_INCORRECT_GUESS = "PUSH_INCORRECT_GUESS",
  PUSH_CORRECT_GUESS = "PUSH_CORRECT_GUESS",
  PUSH_POST_CORRECT_GUESS = "PUSH_POST_CORRECT_GUESS",
  LOAD_STATE = "LOAD_STATE",
}

export type GameAction =
  | { type: GameActionType.SHUFFLE }
  | { type: GameActionType.USE_HINT; payload: string[] }
  | { type: GameActionType.DESELECT_ALL }
  | { type: GameActionType.UNMARK_ALL }
  | {
      type: GameActionType.SELECT_ITEM;
      payload: string;
    }
  | {
      type: GameActionType.MARK_ITEM;
      payload: {
        label: string;
        difficulty: number | null;
      };
    }
  | {
      type: GameActionType.PUSH_GAME_SUMMARY;
      payload: number[];
    }
  | {
      type: GameActionType.PUSH_INCORRECT_GUESS;
      payload: string[];
    }
  | {
      type: GameActionType.PUSH_CORRECT_GUESS;
      payload: string[];
    }
  | {
      type: GameActionType.PUSH_POST_CORRECT_GUESS;
      payload: { category: Category; isPlayerGuess: boolean };
    }
  | {
      type: GameActionType.LOAD_STATE;
      payload: GameState;
    };

export const gameStateReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  console.log("Connections game state action: ", action);

  const newState = (() => {
    switch (action.type) {
      case GameActionType.SHUFFLE:
        const nonMarkedItems = state.grid
          .slice(state.correctGuesses.length)
          .filter(
            (item) =>
              !state.markedItems?.some(
                (markedItem) => markedItem.label == item,
              ),
          );
        const groupedMarkedItems = groupBy(state.markedItems, "difficulty");

        return {
          ...state,
          grid: [
            ...state.grid.slice(0, state.correctGuesses.length),
            ...(groupedMarkedItems[0] || []).map((item) => item.label),
            ...(groupedMarkedItems[1] || []).map((item) => item.label),
            ...(groupedMarkedItems[2] || []).map((item) => item.label),
            ...(groupedMarkedItems[3] || []).map((item) => item.label),
            ...shuffle(nonMarkedItems),
          ],
        };
      case GameActionType.USE_HINT:
        return {
          ...state,
          score: state.score - 10,
          hintsUsed: state.hintsUsed || 0 + 1,
          hintedItems: action.payload,
        };
      case GameActionType.DESELECT_ALL:
        return {
          ...state,
          selected: [],
        };
      case GameActionType.UNMARK_ALL:
        return {
          ...state,
          markedItems: [],
        };
      case GameActionType.SELECT_ITEM: {
        if (state.selected.includes(action.payload)) {
          return {
            ...state,
            selected: state.selected.filter((l) => l !== action.payload),
          };
        }
        if (state.correctGuesses.includes(action.payload)) {
          return state;
        }
        if (state.selected.length === 4) {
          return state;
        }
        return {
          ...state,
          selected: [...state.selected, action.payload],
        };
      }
      case GameActionType.MARK_ITEM: {
        const selectedItems = state.selected.includes(action.payload.label)
          ? state.selected
          : [action.payload.label];

        const difficulty = action.payload.difficulty;

        if (difficulty === null) {
          return {
            ...state,
            markedItems: state.markedItems?.filter(
              (item) => !selectedItems.includes(item.label),
            ),
          };
        }

        return {
          ...state,
          markedItems: [
            ...(state.markedItems || [])?.filter(
              (markedItem) => !selectedItems.includes(markedItem.label),
            ), // filter existing marks that have been selected
            ...selectedItems.map((label) => ({
              label,
              difficulty,
            })), // re-add selected marks with new difficulty
          ],
        };
      }
      case GameActionType.PUSH_GAME_SUMMARY:
        return {
          ...state,
          gameSummary: [...(state.gameSummary || []), action.payload],
        };
      case GameActionType.PUSH_INCORRECT_GUESS:
        return {
          ...state,
          incorrectGuesses: [...state.incorrectGuesses, action.payload],
          guessCount: state.guessCount + 1,
        };
      case GameActionType.PUSH_CORRECT_GUESS:
        return {
          ...state,
          correctGuesses: [...state.correctGuesses, ...action.payload],
          markedItems: state.markedItems?.filter(
            (item) => !action.payload.includes(item.label),
          ),
          grid: [
            ...state.correctGuesses,
            ...action.payload,
            ...state.grid.filter(
              (l) =>
                !action.payload.includes(l) &&
                !state.correctGuesses.includes(l),
            ),
          ],
        };
      case GameActionType.PUSH_POST_CORRECT_GUESS:
        return {
          ...state,
          selected: [],
          hintedItems: [],
          guessCount: action.payload.isPlayerGuess
            ? state.guessCount + 1
            : state.guessCount,
          completedGroups: [...state.completedGroups, action.payload.category],
          score: action.payload.isPlayerGuess
            ? state.score +
              guessMultiplier[state.guessCount] *
                difficultyMultiplier[action.payload.category.difficulty || 0]
            : state.score,
        };
      case GameActionType.LOAD_STATE:
        return action.payload;
      default:
        return state;
    }
  })();

  localStorage.setItem(
    `connections-game-state-${state.date}`,
    JSON.stringify(newState),
  );

  return newState;
};

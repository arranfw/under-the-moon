import { Category } from "@/util/api/connections";

import { difficultyMultiplier, guessMultiplier } from "./util";
import { shuffle } from "lodash";

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
      payload: Category;
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
        return {
          ...state,
          grid: [
            ...state.grid.slice(0, state.correctGuesses.length),
            ...shuffle(state.grid.slice(state.correctGuesses.length)),
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
        if (action.payload.difficulty === null) {
          return {
            ...state,
            markedItems: state.markedItems?.filter(
              (item) => item.label !== action.payload.label,
            ),
          };
        }
        if (
          state.markedItems?.some((item) => item.label === action.payload.label)
        ) {
          return {
            ...state,
            markedItems: state.markedItems?.map((item) => {
              if (item.label === action.payload.label) {
                return {
                  label: item.label,
                  difficulty: action.payload.difficulty!,
                };
              }
              return item;
            }),
          };
        }

        return {
          ...state,
          markedItems: [
            ...(state.markedItems || []),
            {
              label: action.payload.label,
              difficulty: action.payload.difficulty,
            },
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
          guessCount: state.guessCount + 1,
          completedGroups: [...state.completedGroups, action.payload],
          score:
            state.score +
            guessMultiplier[state.guessCount] *
              difficultyMultiplier[action.payload.difficulty || 0],
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

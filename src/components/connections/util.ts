import { NewConnectionsResults } from "@/db/types";
import { ChronoUnit, LocalDate } from "@js-joda/core";

export const connectionsColors = [
  "connections-yellow",
  "connections-green",
  "connections-blue",
  "connections-purple",
];

export const guessMultiplier = [1.771561, 1.61051, 1.4641, 1.331, 1.21, 1.1, 1];
export const difficultyMultiplier = [2, 8, 16, 34];
export const difficultyEmojiMap = ["🟨", "🟩", "🟦", "🟪"];

export const gameDateToGameNumber = (date: string): number =>
  ChronoUnit.DAYS.between(LocalDate.parse("2023-06-11"), LocalDate.parse(date));

export const postGameResult = async (result: NewConnectionsResults) => {
  const res = await fetch(`/api/connectionsResults`, {
    method: "POST",
    body: JSON.stringify(result),
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
};

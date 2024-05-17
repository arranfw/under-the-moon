import { LocalDate } from "@js-joda/core";

export interface Card {
  content: string;
  position: number;
}

export interface Category {
  title: string;
  cards: Card[];
  difficulty?: number;
}

export interface ConnectionsGameData {
  status: string;
  id: number;
  print_date: string;
  editor: string;
  categories: Category[];
}

export const getConnectionsData = async (
  date: LocalDate,
): Promise<ConnectionsGameData> => {
  const res = await fetch(
    `https://www.nytimes.com/svc/connections/v2/${date.toJSON()}.json`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: ConnectionsGameData = await res.json();

  return {
    ...data,
    categories: data.categories.map((category: any, i) => ({
      ...category,
      difficulty: i,
    })),
  };
};

export const connectionsDataToGameState = (
  connectionsData: ConnectionsGameData,
): Category[] => {
  return connectionsData.categories.map((category, i) => ({
    title: category.title,
    cards: category.cards.map((card) => ({
      content: card.content,
      position: card.position,
    })),
    difficulty: i + 1,
  }));
};

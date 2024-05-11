import { shuffle } from "@/util";
import { Category } from "@/util/api/connections";
import { useState } from "react";

type Options = {
  groups: Category[];
};

export type GameState = {
  complete: Category[];
  incomplete: Category[];
  items: string[];
  activeItems: string[];
  mistakesRemaining: number;
};

export const useGame = (options: Options) => {
  const initialState: GameState = {
    incomplete: options.groups,
    complete: [],
    items: options.groups
      .flatMap((g) => g.cards)
      .sort((a, b) => a.position - b.position)
      .map((c) => c.content),
    activeItems: [],
    mistakesRemaining: 3,
  };

  const [game, setGame] = useState(initialState);

  const toggleActive = (item: string) => {
    if (game.activeItems.includes(item)) {
      setGame((prev) => ({
        ...game,
        activeItems: prev.activeItems.filter((i) => i !== item),
      }));
    } else if (game.activeItems.length < 4) {
      setGame((prev) => ({
        ...game,
        activeItems: [...prev.activeItems, item],
      }));
    }
  };

  const shuffleGame = () => {
    setGame((prev) => ({
      ...game,
      items: shuffle(game.items),
    }));
  };

  const deselectAll = () => {
    setGame((prev) => ({
      ...game,
      activeItems: [],
    }));
  };

  const submit = () => {
    const foundGroup = game.incomplete.find((group) =>
      group.cards.every((item) => game.activeItems.includes(item.content)),
    );

    if (foundGroup) {
      const incomplete = game.incomplete.filter(
        (group) => group !== foundGroup,
      );
      setGame((prev) => ({
        ...game,
        complete: [...prev.complete, foundGroup],
        incomplete: [...incomplete],
        items: incomplete.flatMap((group) =>
          group.cards.map((card) => card.content),
        ),
        activeItems: [],
      }));
    } else {
      setGame((prev) => ({
        ...game,
        mistakesRemaining: prev.mistakesRemaining - 1,
        activeItems: [],
      }));
      if (game.mistakesRemaining === 0) {
        setGame((prev) => ({
          ...game,
          complete: [...prev.incomplete],
          incomplete: [],
          items: [],
          activeItems: [],
        }));
      }
    }
  };

  return {
    toggleActive,
    shuffleGame,
    deselectAll,
    submit,
    game,
  };
};

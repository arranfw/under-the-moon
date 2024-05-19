import { cn } from "@/util";
import React from "react";
import { ConnectionsItemMenu } from "./ConnectionsItemMenu";

interface ConnectionsItemProps {
  onClick: (label: string) => void;
  onMarkItem: (label: string, difficulty: number | null) => void;
  col: number;
  row: number;
  label: string;
  selected?: boolean;
  completed?: boolean;
  jiggleIncorrect?: boolean;
  jiggleCorrect?: boolean;
  difficultyMark?: number | null;
}

export const ConnectionsItem: React.FC<ConnectionsItemProps> = ({
  col,
  row,
  label,
  onClick,
  onMarkItem,
  selected,
  completed,
  jiggleIncorrect,
  jiggleCorrect,
  difficultyMark,
}) => {
  return (
    <ConnectionsItemMenu
      onClick={(difficulty) => onMarkItem(label, difficulty)}
    >
      <div
        className={cn(
          "p-1 box-border transition-all duration-1000",
          `absolute w-[25%] h-[25%]`,
          `top-[${(row * 25).toFixed(0)}%] left-[${(col * 25).toFixed(0)}%]`,
        )}
      >
        <button
          onClick={() => onClick(label)}
          className={cn(
            "w-full h-full grid place-content-center z-0",
            "rounded-md uppercase font-bold select-none",
            {
              "bg-stone-200 dark:bg-gray-800": !selected,
              "text-black dark:text-gray-300": !selected,
              "scale-100": !selected,
              "bg-connections-button-active": selected,
              "text-connections-button-active": selected,
              "scale-105": selected,
              "animate-jiggleIncorrect": jiggleIncorrect,
              "animate-jiggleCorrect": jiggleCorrect,
              "cursor-default": completed,
              "md:text-base text-sm": label.length < 8,
              "md:text-xs text-[.65rem]": label.length >= 8,
            },
          )}
        >
          <span
            className={cn(
              "absolute top-0 right-0 w-1/6 h-1/6 bg-white rounded-bl-md rounded-tr-md",
              `bg-connections-difficulty-${difficultyMark}`,
              `dark:bg-connections-difficulty-${difficultyMark}-dark`,
            )}
          />
          {label}
        </button>
      </div>
    </ConnectionsItemMenu>
  );
};

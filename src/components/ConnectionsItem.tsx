import { cn } from "@/util";
import React from "react";

interface ConnectionsItemProps {
  onClick: (label: string) => void;
  col: number;
  row: number;
  label: string;
  selected?: boolean;
  completed?: boolean;
  jiggleIncorrect?: boolean;
  jiggleCorrect?: boolean;
}

export const ConnectionsItem: React.FC<ConnectionsItemProps> = ({
  col,
  row,
  label,
  onClick,
  selected,
  completed,
  jiggleIncorrect,
  jiggleCorrect,
}) => {
  return (
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
          "rounded-md uppercase text-xs font-bold select-none",
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
          },
        )}
      >
        {label}
      </button>
    </div>
  );
};

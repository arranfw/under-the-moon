import React from "react";

import { cn } from "@/util";
import { Category } from "@/util/api/connections";

import { connectionsColors } from "./util";

interface CompletedGroupProps {
  category: Category;
}

export const CompletedGroup: React.FC<CompletedGroupProps> = ({ category }) => {
  return (
    <div
      className={cn(`w-full p-1 uppercase h-1/4 animate-fadeIn animate-popIn`)}
    >
      <div
        data-difficulty={category.difficulty}
        className={cn(
          "flex flex-col justify-center items-center relative z-10 text-center",
          "h-full w-full rounded-md color-black tracking-wider",
          `bg-${connectionsColors[category.difficulty || 0]}`,
        )}
      >
        <p
          className={cn("font-bold", {
            "md:text-base text-xs": category.title.length > 30,
          })}
        >
          {category.title}
        </p>
        <p>{category.cards.map((card) => card.content).join(", ")}</p>
      </div>
    </div>
  );
};

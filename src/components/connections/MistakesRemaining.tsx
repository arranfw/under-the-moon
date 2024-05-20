import { cn } from "@/util";
import React from "react";

interface MistakesRemainingProps {
  incorrectGuessCount: number;
}

export const MistakesRemaining: React.FC<MistakesRemainingProps> = ({
  incorrectGuessCount,
}) => {
  return (
    <div className="flex gap-2">
      {Array(4)
        .fill("")
        .map((_, i) => (
          <div
            key={i}
            className={cn("rounded-full w-4 h-4", {
              "bg-transparent": i >= Math.abs(incorrectGuessCount - 4),
              "bg-connections-button-active dark:bg-white":
                i < Math.abs(incorrectGuessCount - 4),
            })}
          />
        ))}
    </div>
  );
};

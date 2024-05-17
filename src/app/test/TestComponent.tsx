"use client";

import { cn } from "@/util";
import { setgid } from "process";
import React, { useState } from "react";
import lodashShuffle from "lodash/shuffle";

interface TestItemProps {
  onClick: (label: number) => void;
  col: number;
  row: number;
  label: number;
  selected?: boolean;
  completed?: boolean;
}

export const TestItem: React.FC<TestItemProps> = ({
  col,
  row,
  label,
  onClick,
  selected,
  completed,
}) => {
  if (process.stdout) {
    process.stdout.write(`${col},${row}`.padStart(2, "0") + " ");
    if (col % 4 === 0) {
      process.stdout.write("\n");
    }
  }

  return (
    <div
      onClick={() => onClick(label)}
      className={cn(
        "absolute border border-red-500 w-[40px] h-[40px] grid place-content-center transition-all duration-500",
        `top-[${(row * 25).toFixed(0)}%] left-[${(col * 25).toFixed(0)}%]`,
        { "bg-slate-400": selected },
        { "opacity-0": completed },
      )}
    >
      {label}
    </div>
  );
};

const initialGrid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export const TestComponent = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [selected, setSelected] = useState<number[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<number[]>([]);
  const numberOfCorrectGuesses = correctGuesses.length;

  const promoteLabels = (labels: number[]) => {
    setGrid((prev) => [
      ...correctGuesses,
      ...labels,
      ...prev.filter((l) => !labels.includes(l) && !correctGuesses.includes(l)),
    ]);
  };
  const shuffle = () => {
    setGrid((prev) => [
      ...prev.slice(0, numberOfCorrectGuesses),
      ...lodashShuffle(prev.slice(numberOfCorrectGuesses)),
    ]);
  };

  const doThing = () => {
    if (selected.length !== 4) {
      return;
    }
    promoteLabels(selected);
    setSelected([]);
    setCorrectGuesses((prev) => [...prev, ...selected]);
  };

  const handleSelect = (label: number) => {
    setSelected((prev) => {
      if (prev.includes(label)) {
        return prev.filter((l) => l !== label);
      }
      if (correctGuesses.includes(label)) {
        console.log("clicking correct guess");

        return prev;
      }
      if (prev.length === 4) {
        console.log("4 selected already");

        return prev;
      }
      return [...prev, label];
    });
  };

  // console.log(grid.map(([col, row, label]) => label));

  return (
    <div className="">
      <div className="relative border w-40 h-40">
        {Array(16)
          .fill(0)
          .map((_, label) => (
            <TestItem
              onClick={handleSelect}
              key={label}
              col={grid.indexOf(label) % 4}
              row={Math.floor(grid.indexOf(label) / 4)}
              label={label}
              selected={selected.includes(label)}
              completed={correctGuesses.includes(label)}
            />
          ))}
      </div>
      <div className="flex flex-col">
        <button onClick={doThing}>action</button>
        <button onClick={shuffle}>shuffle</button>
      </div>
    </div>
  );
};

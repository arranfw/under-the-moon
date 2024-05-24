import React from "react";

import { cn } from "@/util";

import { LocalDate } from "@js-joda/core";
import Link from "next/link";

export const PlayLink = () => {
  const today = LocalDate.now();
  return (
    <Link
      href={`/connections/${today.toJSON()}`}
      className={cn(
        "rounded-full",
        "px-12 py-2 text-lg text-white bg-black dark:text-black dark:bg-white",
      )}
    >
      Play
    </Link>
  );
};

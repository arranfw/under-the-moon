"use client";

import React, { useState } from "react";

import { cn } from "@/util";

import * as RadixTooltip from "@radix-ui/react-tooltip";

interface TooltipProps extends React.PropsWithChildren {
  tooltipContent: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  tooltipContent,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root open={open} onOpenChange={setOpen}>
        <RadixTooltip.Trigger
          onClick={() => setOpen((prevOpen) => !prevOpen)}
          onFocus={() => setTimeout(() => setOpen(true), 0)} // timeout needed to run this after onOpenChange to prevent bug on mobile
          onBlur={() => setOpen(false)}
        >
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className={cn(
              "py-1 px-2 rounded-lg",
              "bg-zinc-50 dark:bg-zinc-900 border",
              "border-zinc-400 border-opacity-50 dark:border-zinc-800",
            )}
            sideOffset={5}
          >
            {tooltipContent}
            <RadixTooltip.Arrow className="fill-zinc-400 fill-opacity-50 dark:fill-zinc-800" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

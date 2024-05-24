import React from "react";

import { cn } from "@/util";

import * as RadixSeparator from "@radix-ui/react-separator";

interface SeparatorProps {
  className?: string;
}

export const Divider: React.FC<SeparatorProps> = ({ className }) => (
  <RadixSeparator.Root className={cn("SeparatorRoot bg-gray-600", className)} />
);

import React from "react";

import { cn } from "@/util";

interface ConnectionsActionButton extends React.PropsWithChildren {
  onClick: () => void;
  disabled?: boolean;
}

export const ConnectionsActionButton: React.FC<ConnectionsActionButton> = ({
  children,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn("border rounded-full p-4 py-3 md:text-lg text-base", {
        "border-black dark:border-white": !disabled,
        "border-gray-500": disabled,
        "text-gray-500": disabled,
      })}
    >
      {children}
    </button>
  );
};
import { cn } from "@/app/util";
import React from "react";

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
      className={cn("border rounded-full px-2 py-3", {
        "border-black": !disabled,
        "border-gray-500": disabled,
        "text-gray-500": disabled,
      })}
    >
      {children}
    </button>
  );
};

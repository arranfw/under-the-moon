import { cn } from "@/util";
import React, { useEffect } from "react";

interface ConnectionsItemProps extends React.PropsWithChildren {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

export const ConnectionsItem: React.FC<ConnectionsItemProps> = ({
  children,
  onClick,
  active,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border rounded-md uppercase text-xs font-bold select-none h-20",
        {
          "bg-connections-button": !active,
          "text-connections-button": !active,
          "scale-100": !active,
          "bg-connections-button-active": active,
          "text-connections-button-active": active,
          "scale-105": active,
        },
      )}
    >
      {children}
    </button>
  );
};

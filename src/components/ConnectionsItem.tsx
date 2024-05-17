import { cn } from "@/util";
import React, { useEffect } from "react";

interface ConnectionsItemProps extends React.PropsWithChildren {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  jiggle?: boolean;
}

export const ConnectionsItem: React.FC<ConnectionsItemProps> = ({
  children,
  onClick,
  active,
  jiggle,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn("rounded-md uppercase text-xs font-bold select-none h-20", {
        "bg-stone-200 dark:bg-gray-800": !active,
        "text-black dark:text-gray-300": !active,
        "scale-100": !active,
        "bg-connections-button-active": active,
        "text-connections-button-active": active,
        "scale-105": active,
        "animate-wiggle": jiggle,
      })}
    >
      {children}
    </button>
  );
};

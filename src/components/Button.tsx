import React from "react";

import { cn } from "@/util";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ButtonProps extends React.PropsWithChildren {
  onClick?: () => void;
  variant?: "solid" | "ghost" | "transparent";
  tone?: "critical" | "formAccent" | "neutral";
  size?: "medium";
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  size = "medium",
  tone = "neutral",
  variant = "ghost",
  onClick,
  disabled,
  loading,
  children,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "active-playful",
        "border rounded-full",
        "hover:brightness-90 dark:hover:brightness-125",
        "disabled:opacity-50",
        {
          "border-transparent": ["solid", "transparent"].includes(variant),
          "bg-transparent": ["solid", "transparent"].includes(variant),
          "border-black dark:border-white": tone === "neutral",
          "bg-blue-300 dark:bg-blue-500": tone === "formAccent",
          "bg-red-300 dark:bg-red-500": tone === "critical",
          "px-4 py-2": size === "medium",
        },
      )}
    >
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

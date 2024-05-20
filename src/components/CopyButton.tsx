import { cn } from "@/util";
import {
  faCheck,
  faCheckCircle,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface CopyButtonProps {
  copyText: string | undefined;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ copyText }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCopySummary = () => {
    if (copyText) {
      navigator.clipboard.writeText(copyText);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    }
  };

  return (
    <button className="h-8 w-8 rounded-full" onClick={handleCopySummary}>
      <FontAwesomeIcon
        icon={showSuccess ? faCheck : faClipboard}
        className={cn("h-full w-full", {
          "text-green-500 animate-ping": showSuccess,
        })}
      />
    </button>
  );
};

import React, { useState } from "react";

import { cn } from "@/util";

import {
  faCheck,
  faCheckCircle,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CopyButtonProps {
  getCopyText: () => string | undefined;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ getCopyText }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCopySummary = () => {
    const copyText = getCopyText();

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

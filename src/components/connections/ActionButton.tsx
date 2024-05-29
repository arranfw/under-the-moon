import React from "react";

import { cn } from "@/util";

import { Button } from "../Button";

interface ConnectionsActionButton extends React.PropsWithChildren {
  onClick?: () => void;
  disabled?: boolean;
}

export const ConnectionsActionButton: React.FC<ConnectionsActionButton> = ({
  children,
  onClick,
  disabled,
}) => {
  return (
    <Button onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
};

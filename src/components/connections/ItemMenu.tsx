import React from "react";

import { cn } from "@/util";

import { connectionsColors } from "./util";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { isNil } from "lodash";

interface ColorMenuItemProps extends React.PropsWithChildren {
  difficulty: number | null;
  onClick: (difficulty: number | null) => void;
}
const ColorMenuItem: React.FC<ColorMenuItemProps> = ({
  difficulty,
  children,
  onClick,
}) => (
  <ContextMenu.Item
    onClick={() => onClick(difficulty)}
    className={cn("py-2 pl-4 pr-8 hover:brightness-110 cursor-pointer", {
      [`bg-${connectionsColors[difficulty ?? 0]}`]: !isNil(difficulty),
      "bg-connections-button dark:bg-gray-800": isNil(difficulty),
    })}
  >
    {children}
  </ContextMenu.Item>
);

interface ConnectionsItemMenuProps extends React.PropsWithChildren {
  onClick: (difficulty: number | null) => void;
}
export const ConnectionsItemMenu: React.FC<ConnectionsItemMenuProps> = ({
  children,
  onClick,
}) => (
  <ContextMenu.Root>
    <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Content className="mt-2 rounded-md shadow-lg overflow-hidden">
        <ColorMenuItem onClick={onClick} difficulty={0}>
          Yellow
        </ColorMenuItem>
        <ColorMenuItem onClick={onClick} difficulty={1}>
          Green
        </ColorMenuItem>
        <ColorMenuItem onClick={onClick} difficulty={2}>
          Blue
        </ColorMenuItem>
        <ColorMenuItem onClick={onClick} difficulty={3}>
          Purple
        </ColorMenuItem>
        <ColorMenuItem onClick={onClick} difficulty={null}>
          Clear
        </ColorMenuItem>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  </ContextMenu.Root>
);

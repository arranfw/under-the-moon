import { cn } from "@/util";
import * as ContextMenu from "@radix-ui/react-context-menu";
import React from "react";

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
    className={cn("py-1 px-4", {
      [`bg-connections-difficulty-${difficulty} dark:bg-connections-difficulty-${difficulty}-dark`]:
        difficulty !== null,
      "bg-connections-button dark:bg-gray-800": difficulty === null,
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
    <ContextMenu.Trigger className="">{children}</ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Content
        alignOffset={5}
        className="rounded-md shadow-lg overflow-hidden text-black dark:text-white"
      >
        {/* <ContextMenu.Label className="py-1 px-4 text-sm bg-connections-button dark:bg-gray-800">
          Mark item color
        </ContextMenu.Label> */}
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

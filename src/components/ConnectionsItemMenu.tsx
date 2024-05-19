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
    className={cn("py-1 pl-4 pr-8 hover:brightness-110 cursor-pointer", {
      "bg-connections-difficulty-0 dark:bg-connections-difficulty-0-dark":
        difficulty === 0,
      "bg-connections-difficulty-1 dark:bg-connections-difficulty-1-dark":
        difficulty === 1,
      "bg-connections-difficulty-2 dark:bg-connections-difficulty-2-dark":
        difficulty === 2,
      "bg-connections-difficulty-3 dark:bg-connections-difficulty-3-dark":
        difficulty === 3,
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

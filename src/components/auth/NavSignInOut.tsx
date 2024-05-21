"use client";

import React from "react";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/util";

interface NavSignInOutProps {
  session: Session | null;
}

export const NavSignInOut: React.FC<NavSignInOutProps> = ({ session }) => {
  if (session) {
    return (
      <div className="flex items-center gap-2">
        <div>{session.user?.email || ""}</div>
        {session.user?.image && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="rounded-full">
              <img
                src={session.user.image}
                alt={session.user.name || ""}
                className="h-8 w-8 rounded-full"
              />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                collisionPadding={20}
                className="mt-2 rounded-md shadow-lg overflow-hidden"
              >
                <DropdownMenu.Item
                  onClick={() => signOut()}
                  className={cn(
                    "py-1 pl-4 pr-8 hover:brightness-110 cursor-pointer bg-connections-button dark:bg-gray-800",
                  )}
                >
                  Sign Out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>
    );
  }

  return <button onClick={() => signIn()}>Sign In</button>;
};

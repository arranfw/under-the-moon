"use client";

import React from "react";

import { cn } from "@/util";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

interface NavSignInOutProps {
  session: Session | null;
}

export const NavSignInOut: React.FC<NavSignInOutProps> = ({ session }) => {
  if (session) {
    return (
      <div className="flex items-center gap-2">
        <div>{session.user?.name || ""}</div>
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
                className={cn(
                  "z-20",
                  "mt-2 rounded-md shadow-md overflow-hidden p-2 w-32",
                  "bg-zinc-50 dark:bg-zinc-900",
                )}
              >
                <DropdownMenu.Item
                  onClick={() => signOut()}
                  className={cn(
                    "px-2 py-1 rounded cursor-pointer ",
                    "hover:bg-slate-200 hover:dark:bg-zinc-700",
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

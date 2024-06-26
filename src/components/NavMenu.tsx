"use client";

import React from "react";

import { hasRecentChanges } from "@/app/changelog/page";
import { cn } from "@/util";

import { Divider } from "./Divider";
import { faBars, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LocalDate } from "@js-joda/core";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "vaul";

interface NavItemProps {
  label: React.ReactNode;
  href: string;
  inset?: number;
}

const NavItem: React.FC<NavItemProps> = ({ label, href, inset }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <NavigationMenu.Item>
      <NavigationMenu.Link asChild>
        <Drawer.Close asChild>
          <Link
            prefetch
            href={href}
            className={cn(
              "flex gap-2 items-center relative rounded pl-2 text-lg",
              "hover:bg-slate-200 hover:dark:bg-zinc-700",
              {
                [`ml-${inset}`]: inset,
                "font-semibold": active,
              },
            )}
          >
            {active && (
              <span className="h-4 w-1 absolute -left-1 bg-green-500" />
            )}
            {label}
          </Link>
        </Drawer.Close>
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  );
};

interface DrawerIconProps {
  notification?: boolean;
}

const DrawerIcon: React.FC<DrawerIconProps> = ({ notification }) => (
  <>
    <FontAwesomeIcon className="h-4 w-4" icon={faBars} />
    {notification && (
      <FontAwesomeIcon
        className="absolute top-1 right-1 text-green-500"
        fontSize={10}
        icon={faCircle}
      />
    )}
  </>
);

interface NavMenuProps {}

export const NavMenu: React.FC<NavMenuProps> = () => {
  const todayString = LocalDate.now().toJSON();

  return (
    <Drawer.Root direction="left">
      <Drawer.Trigger className="rounded-full flex p-2 relative">
        <DrawerIcon notification={hasRecentChanges} />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content
          className={cn(
            "h-full p-4 fixed top-0 z-20",
            "backdrop-blur-lg backdrop-brightness-105 dark:backdrop-brightness-25",
            "shadow-md dark:shadow-slate-900",
          )}
        >
          <div className="flex items-center justify-center gap-4">
            <Drawer.Close className="rounded-full flex p-2 relative">
              <DrawerIcon notification={hasRecentChanges} />
            </Drawer.Close>
            <h1 className="font-semibold">Under the Moon</h1>
          </div>
          <Divider className="my-2 mt-4" />
          <NavigationMenu.Root>
            <NavigationMenu.List className="flex flex-col gap-1">
              <NavItem href={"/connections"} label="Connections" />
              <NavItem
                href={`/connections/${todayString}`}
                label="Today's game"
                inset={3}
              />
              <NavItem
                href={`/connections/${todayString}/results`}
                label="Today's results"
                inset={3}
              />
              <NavItem
                href={`/connections/results`}
                label="Recent results"
                inset={3}
              />

              <Divider className="my-2" />

              {/* <NavItem href={`/pyho`} label="Pyho" />

              <Divider className="my-2" />

              <NavItem href={`/morrow`} label="Morrow" />

              <Divider className="my-2" /> */}

              <NavItem
                href={`/circles`}
                label={
                  <>
                    Circles
                    {hasRecentChanges && (
                      <span className="rounded-full bg-green-300 dark:bg-green-700 px-2 py-1 text-xs">
                        New
                      </span>
                    )}
                  </>
                }
              />

              <Divider className="my-2" />

              <NavItem href={`/changelog`} label="What's new" />
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
};

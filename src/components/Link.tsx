import React from "react";

import { cn } from "@/util";

import NextLink, { LinkProps as NextLinkProps } from "next/link";

interface LinkProps extends NextLinkProps, React.PropsWithChildren {
  className?: string;
  variant?: "regular" | "no-underline";
}

export const Link: React.FC<LinkProps> = ({
  className,
  variant = "regular",
  href,
  children,
}) => {
  return (
    <NextLink
      className={cn(className, {
        underline: variant === "regular",
      })}
      href={href}
    >
      {children}
    </NextLink>
  );
};

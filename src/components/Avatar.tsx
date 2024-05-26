"use client";

import React from "react";

import { cn } from "@/util";

import * as RadixAvatar from "@radix-ui/react-avatar";

interface AvatarProps {
  imageUrl: string;
  fallbackText: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  fallbackText,
  size,
  className,
}) => {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <RadixAvatar.Root
        className={cn("AvatarRoot", "", className)}
        style={{
          height: size,
          width: size,
        }}
      >
        <RadixAvatar.Image
          className="AvatarImage"
          src={imageUrl}
          alt={fallbackText}
        />
        <RadixAvatar.Fallback className="AvatarFallback" delayMs={600}>
          {fallbackText}
        </RadixAvatar.Fallback>
      </RadixAvatar.Root>
    </div>
  );
};

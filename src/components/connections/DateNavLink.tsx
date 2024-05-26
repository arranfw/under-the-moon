import React from "react";

import { cn } from "@/util";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface ConnectionsDateNavLinkProps {
  href: string;
  icon: IconProp;
}

export const ConnectionsDateNavLink: React.FC<ConnectionsDateNavLinkProps> = ({
  href,
  icon,
}) => {
  return (
    <Link
      prefetch
      href={href}
      className={cn(
        "rounded-full shrink-0 dark:border-white w-8 h-8 flex items-center justify-center",
        "hover:bg-gray-200 dark:hover:bg-gray-800",
      )}
    >
      <FontAwesomeIcon icon={icon} fontSize={18} className="text-inherit" />
    </Link>
  );
};

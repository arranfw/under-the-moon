import React from "react";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer } from "vaul";

interface NavMenuProps {}

export const NavMenu: React.FC<NavMenuProps> = () => {
  return (
    <div>
      <FontAwesomeIcon icon={faBars} />
    </div>
  );
};

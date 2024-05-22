import React from "react";

interface ConnectionsLayoutProps extends React.PropsWithChildren {}

const Layout: React.FC<ConnectionsLayoutProps> = ({ children }) => {
  return (
    <div className="h-full md:w-120 w-full flex flex-col m-auto">
      {children}
    </div>
  );
};

export default Layout;

import React from "react";

interface ConnectionsLayoutProps extends React.PropsWithChildren {}

const Layout: React.FC<ConnectionsLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex items-center flex-col gap-6 mb-6">
        <h1 className="text-4xl font-bold">Circles</h1>
      </div>
      {children}
    </>
  );
};

export default Layout;

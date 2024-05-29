import React from "react";

interface ConnectionsLayoutProps extends React.PropsWithChildren {}

const Layout: React.FC<ConnectionsLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex items-center flex-col gap-6 mb-6">
        <div className="flex items-end gap-2">
          <h1 className="text-4xl font-bold">Connections</h1>
        </div>
      </div>
      {children}
    </>
  );
};

export default Layout;

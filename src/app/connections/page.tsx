"use client";

import { PlayLink } from "./PlayLink";

const Connections = async () => {
  return (
    <div className="h-full w-96 flex flex-col m-auto">
      <div className="flex items-center flex-col gap-6 mb-6">
        <div className="flex flex-col items-center gap-4 md:pt-40 pt-12">
          <h1 className="text-4xl font-bold">Connections</h1>
          <p className="text-lg">Group words that share a common thread.</p>
          <PlayLink />
        </div>
      </div>
    </div>
  );
};

export default Connections;

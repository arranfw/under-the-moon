"use client";

import { PlayLink } from "@/components/connections/PlayLink";

const Connections = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg">Group words that share a common thread.</p>
      <PlayLink />
    </div>
  );
};

export default Connections;

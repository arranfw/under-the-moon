import { ConnectionsGame } from "@/components/ConnectionsGame";
import { getConnectionsData } from "@/util/api/connections";
import { LocalDate } from "js-joda";

const difficultyColor = (difficulty: 1 | 2 | 3 | 4): string => {
  return {
    1: "#fbd400",
    2: "#b5e352",
    3: "#729eeb",
    4: "#bc70c4",
  }[difficulty];
};

const Connections = async () => {
  const today = LocalDate.now();
  const data = await getConnectionsData(today);

  return (
    <div className="h-full">
      <div className="flex justify-center">
        <div className="w-96">
          <div className="flex items-center flex-col">
            <h1 className="text-4xl mb-2 font-bold">Connections</h1>
            <p className="w-full text-center mb-4">
              Create four groups of four!
            </p>
          </div>
          <ConnectionsGame gameData={data} />
        </div>
      </div>
    </div>
  );
};

export default Connections;

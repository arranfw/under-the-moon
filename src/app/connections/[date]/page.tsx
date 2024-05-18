import { gameDataToGrid, getConnectionsData } from "@/util/api/connections";
import { LocalDate } from "@js-joda/core";
import "@js-joda/locale_en";
import { ConnectionsGame } from "../../../components/ConnectionsGame";

const Connections = async ({ params }: { params: { date: string } }) => {
  const date =
    typeof params.date === "string"
      ? LocalDate.parse(params.date)
      : LocalDate.now();

  const gameData = await getConnectionsData(date);
  const gameGrid = gameDataToGrid(gameData);

  return (
    <ConnectionsGame
      categories={gameData.categories}
      gameGrid={gameGrid}
      date={gameData.print_date}
    />
  );
};

export default Connections;

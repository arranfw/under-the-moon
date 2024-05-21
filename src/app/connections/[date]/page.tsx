import { gameDataToGrid, getConnectionsData } from "@/util/api/connections";
import { ChronoUnit, LocalDate } from "@js-joda/core";
import "@js-joda/locale_en";
import { ConnectionsGame } from "@/components/connections/Game";

const Connections = async ({ params }: { params: { date: string } }) => {
  const date =
    typeof params.date === "string"
      ? LocalDate.parse(params.date)
      : LocalDate.now();

  const gameData = await getConnectionsData(date);

  if (!gameData) {
    return (
      <div className="w-full h-56 grid place-content-center text-xl">
        Not released yet!
      </div>
    );
  }

  const gameGrid = gameDataToGrid(gameData);

  return (
    <ConnectionsGame
      gameNumber={ChronoUnit.DAYS.between(
        LocalDate.parse("2023-06-11"),
        LocalDate.parse(gameData.print_date),
      )}
      categories={gameData.categories}
      gameGrid={gameGrid}
      date={gameData.print_date}
    />
  );
};

export default Connections;

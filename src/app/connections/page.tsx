import { ConnectionsDateNavLink } from "@/components/ConnectionsDateNavLink";
import { gameDataToGrid, getConnectionsData } from "@/util/api/connections";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { DateTimeFormatter, LocalDate } from "@js-joda/core";
import "@js-joda/locale_en";
import { Locale } from "@js-joda/locale_en";
import { ConnectionsGame } from "../../components/ConnectionsGame";

const dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy").withLocale(
  Locale.ENGLISH,
);

const Connections = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const date =
    typeof searchParams.date === "string"
      ? LocalDate.parse(searchParams.date)
      : LocalDate.now();

  const gameData = await getConnectionsData(date);
  const gameGrid = gameDataToGrid(gameData);

  const todayString = date.format(dateFormatter);

  return (
    <div className="h-full w-96 flex flex-col m-auto">
      <div className="flex items-center flex-col gap-6 mb-6">
        <div className="flex items-end gap-2">
          <h1 className="text-4xl font-bold">Connections</h1>
        </div>
        <div className="flex w-full justify-between items-center">
          <ConnectionsDateNavLink
            href={`/connections?date=${date.minusDays(1).toJSON()}`}
            icon={faAngleLeft}
          />
          <p className="text-lg">{todayString}</p>
          <ConnectionsDateNavLink
            href={`/connections?date=${date.plusDays(1).toJSON()}`}
            icon={faAngleRight}
          />
        </div>
        <p>Create four groups of four!</p>
      </div>
      <ConnectionsGame
        categories={gameData.categories}
        gameGrid={gameGrid}
        date={gameData.print_date}
      />
    </div>
  );
};

export default Connections;

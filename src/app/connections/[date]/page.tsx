import { gameDataToGrid, getConnectionsData } from "@/util/api/connections";
import { LocalDate } from "@js-joda/core";
import "@js-joda/locale_en";
import { ConnectionsGame } from "@/components/connections/Game";
import { ConnectionsDateNavLink } from "@/components/connections/DateNavLink";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { dayMonthYearFormatter } from "@/util/date";
import {
  createConnectionsResult,
  getConnectionsResults,
} from "@/db/repositories";
import { auth } from "@/auth";

const Connections = async ({ params }: { params: { date: string } }) => {
  const session = await auth();
  const date =
    typeof params.date === "string"
      ? LocalDate.parse(params.date)
      : LocalDate.now();
  const todayString = date.format(dayMonthYearFormatter);

  const gameData = await getConnectionsData(date);
  const userResult = (
    await getConnectionsResults({
      date: params.date,
      userId: session?.user?.id,
    })
  )[0];

  if (!gameData) {
    return (
      <div className="w-full h-56 grid place-content-center text-xl">
        Not released yet!
      </div>
    );
  }

  const gameGrid = gameDataToGrid(gameData);

  return (
    <>
      <div className="flex items-center flex-col gap-6 mb-6">
        <div className="flex items-end gap-2">
          <h1 className="text-4xl font-bold">Connections</h1>
        </div>
        <div className="flex w-full justify-between items-center">
          <ConnectionsDateNavLink
            href={`/connections/${date.minusDays(1).toJSON()}`}
            icon={faAngleLeft}
          />
          <p className="text-lg">{todayString}</p>
          <ConnectionsDateNavLink
            href={`/connections/${date.plusDays(1).toJSON()}`}
            icon={faAngleRight}
          />
        </div>
        <p>Create four groups of four!</p>
      </div>
      <ConnectionsGame
        categories={gameData.categories}
        gameGrid={gameGrid}
        date={gameData.print_date}
        userResult={userResult}
        createConnectionsResult={async (result) => {
          "use server";
          if (!session?.user?.id || userResult) {
            return;
          }

          return createConnectionsResult({
            ...result,
            userId: session?.user.id,
          });
        }}
      />
    </>
  );
};

export default Connections;

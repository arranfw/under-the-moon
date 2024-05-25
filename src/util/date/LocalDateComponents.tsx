"use client";

import { shortTimeFormatter } from ".";
import { ZonedDateTime, ZoneId } from "@js-joda/core";

export const LocalDateShortTime = ({ date }: { date: string | null }) => {
  if (!date) return null;
  return (
    <>
      {ZonedDateTime.parse(date)
        .withZoneSameInstant(ZoneId.SYSTEM)
        .format(shortTimeFormatter)}
    </>
  );
};

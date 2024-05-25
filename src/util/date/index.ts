import { DateTimeFormatter } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";

export const dayMonthYearFormatter = DateTimeFormatter.ofPattern(
  "MMM dd, yyyy",
).withLocale(Locale.ENGLISH);

export const shortTimeFormatter = DateTimeFormatter.ofPattern(
  "h:mm a",
).withLocale(Locale.ENGLISH);

export * from "./LocalDateComponents";

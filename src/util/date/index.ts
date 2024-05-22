import { DateTimeFormatter } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";

export const dayMonthYearFormatter = DateTimeFormatter.ofPattern(
  "MMM dd, yyyy",
).withLocale(Locale.ENGLISH);

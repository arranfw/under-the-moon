import { Expression, sql } from "kysely";

export const getSingle = <T>(records: T[]): T => records[0];

export const any = <T>(expr: Expression<T[]>) => sql<T>`ANY(${expr})`;

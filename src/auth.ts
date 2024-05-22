import NextAuth from "next-auth";
import { KyselyAdapter } from "@auth/kysely-adapter";
import authConfig from "./auth.config";
import { db } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: KyselyAdapter(db as any),
  session: { strategy: "jwt" },
  ...authConfig,
});

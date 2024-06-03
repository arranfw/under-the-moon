import { auth } from "@/auth";
import { NavSignInOut } from "@/components/auth/NavSignInOut";
import { NavMenu } from "@/components/NavMenu";
import { cn } from "@/util";

import { SpeedInsights } from "@vercel/speed-insights/next";

import "@fortawesome/fontawesome-svg-core/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Under the Moon",
  description: "Arran's everything app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "h-full flex flex-col")}>
        <nav
          className={cn(
            "flex justify-between items-center p-4 sticky top-0 z-10",
            "bg-base shadow dark:shadow-slate-900",
          )}
        >
          <div className="flex items-center justify-center gap-4">
            <NavMenu />
            <h1 className="font-semibold">Under the Moon</h1>
          </div>
          <div>
            <NavSignInOut session={session} />
          </div>
        </nav>
        <main className="overflow-y-auto grow md:p-12 px-4 py-6">
          <div
            className={cn(
              "h-full w-full md:w-140 flex flex-col items-center",
              "m-auto gap-6",
            )}
          >
            {children}
            <SpeedInsights />
          </div>
        </main>
        <footer className="backdrop-blur-lg backdrop-brightness-105 grid w-full px-2 py-1 border-t border border-border">
          <div className="place-self-end">
            <Link href="/changelog">Changelog</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}

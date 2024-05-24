import { auth } from "@/auth";
import { NavSignInOut } from "@/components/auth/NavSignInOut";
import { NavMenu } from "@/components/NavMenu";
import { cn } from "@/util";

import "@fortawesome/fontawesome-svg-core/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

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
      <body className={cn(inter.className, "h-full")}>
        <nav className="flex justify-between items-center p-4 sticky top-0">
          <div className="flex items-center justify-center gap-4">
            <NavMenu />
            <h1 className="font-semibold">Under the Moon</h1>
          </div>
          <div>
            <NavSignInOut session={session} />
          </div>
        </nav>
        <main className="md:p-12 p-2 py-6">{children}</main>
      </body>
    </html>
  );
}

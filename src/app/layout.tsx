import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/util";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { auth } from "@/auth";
import { NavSignInOut } from "@/components/auth/NavSignInOut";

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
        <nav className="flex justify-between p-4 sticky top-0">
          <h1>Under the Moon</h1>
          <div>
            <NavSignInOut session={session} />
          </div>
        </nav>
        <main className="md:p-12 p-2 py-6">{children}</main>
      </body>
    </html>
  );
}

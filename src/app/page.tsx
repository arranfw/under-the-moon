import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";

export default function Home() {
  redirect("/connections", RedirectType.replace);
}

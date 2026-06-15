import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CalendarApp } from "./_components/calendar-app";

export default async function CalendarPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return <CalendarApp />;
}

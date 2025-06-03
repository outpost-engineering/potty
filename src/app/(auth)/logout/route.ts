import { NextResponse } from "next/server";
import { clearSession } from "~/utils/session";

export async function GET() {
  await clearSession();
  return NextResponse.redirect(process.env.BASE_URL!);
}

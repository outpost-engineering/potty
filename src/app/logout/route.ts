import { NextResponse } from "next/server";
import { deleteSession } from "~/libs/auth";

export async function GET() {
  await deleteSession();
  return NextResponse.redirect(process.env.BASE_URL!);
}

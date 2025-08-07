import { NextResponse } from "next/server";
import { getSqlPool }   from "@/lib/db";

export async function GET() {
  const pool = await getSqlPool();
  const provinces = await pool.request()
    .query`SELECT code,nom FROM Province ORDER BY code`
    .then(r=>r.recordset);
  return NextResponse.json(provinces);
}

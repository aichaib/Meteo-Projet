// app/api/test-azure/route.js
import { NextResponse } from "next/server";
import { getSqlPool } from "@/lib/db";

export async function GET() {
  try {
    const pool   = await getSqlPool();
    const result = await pool.request().query("SELECT 1 AS test");
    return NextResponse.json({ ok: result.recordset[0].test === 1 });
  } catch (err) {
    console.error("Erreur de connexion Azure SQL :", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

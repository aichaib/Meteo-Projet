import { NextResponse } from "next/server";
import { getSqlPool }   from "@/lib/db";

export async function GET(_, { params }) {
  const annee = parseInt(params.annee,10);
  const pool  = await getSqlPool();
  const idA   = await pool.request().input("y",annee)
               .query`SELECT id_annee FROM Annee WHERE annee=@y`
               .then(r=>r.recordset[0]?.id_annee);
  if(!idA) return NextResponse.json({error:"Année inconnue"},{status:404});

  const rows = await pool.request().input("idA",idA)
    .query`
      SELECT p.code, p.nom,
             MAX(CASE WHEN s.nom LIKE 'OpenMeteo%'  THEN f.temperature_moy  END) AS temperature,
             MAX(CASE WHEN s.nom LIKE 'OpenMeteo%'  THEN f.precipitation_moy END) AS precipitation,
             MAX(CASE WHEN f.co2_moy_mt IS NOT NULL THEN f.co2_moy_mt        END) AS co2
      FROM Fait_Meteo f
      JOIN Province p ON p.id_province=f.fk_id_province
      LEFT JOIN Station  s ON s.id_station=f.fk_id_station
      WHERE f.fk_id_annee=@idA
      GROUP BY p.code,p.nom
      ORDER BY p.code`;
  return NextResponse.json(rows);
}

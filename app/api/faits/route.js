import { getSqlPool } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type    = searchParams.get("type");
    const metric  = searchParams.get("metric");      // "temp" | "precip" | "co2" (optionnel)
    const prov    = searchParams.get("province");    // "QC" etc. (optionnel)
    const annee   = searchParams.get("annee");       // "2023" (optionnel)

    if (type === "annees") {
      try {
        const pool = await getSqlPool();
        const r = await pool.request().query(`
          SELECT annee FROM Annee ORDER BY annee DESC
        `);
        return Response.json(r.recordset);
      } catch {
        return Response.json(
          [{ annee: 2024 }, { annee: 2023 }, { annee: 2022 }, { annee: 2021 }, { annee: 2020 }, { annee: 2019 }]
        );
      }
    }

    const pool = await getSqlPool();

    // petits WHERE dynamiques
    const where = [];
    if (prov)  where.push(`p.code = @prov`);
    if (annee) where.push(`a.annee = @annee`);
    if (metric === "co2")     where.push(`f.co2_moy_mt IS NOT NULL`);
    if (metric === "temp")    where.push(`f.temperature_moy IS NOT NULL`);
    if (metric === "precip")  where.push(`f.precipitation_moy IS NOT NULL`);
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const req = pool.request();
    if (prov)  req.input("prov", prov);
    if (annee) req.input("annee", +annee);

    const result = await req.query(`
      SELECT
        p.code           AS province_code,
        p.nom            AS province_nom,
        s.nom            AS station,
        s.latitude,
        s.longitude,
        src.nom          AS source_nom,
        src.url          AS source_url,
        a.annee,
        f.temperature_moy,
        f.precipitation_moy,
        f.co2_moy_mt
      FROM Fait_Meteo f
      JOIN Province p     ON f.fk_id_province = p.id_province
      LEFT JOIN Station s ON f.fk_id_station  = s.id_station   -- <- clé: garder les lignes CO2 sans station
      JOIN Annee a        ON f.fk_id_annee    = a.id_annee
      JOIN Source src     ON src.id_source    = f.fk_id_source
      ${whereSql}
      ORDER BY p.code, a.annee ASC
    `);

    return Response.json(result.recordset);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

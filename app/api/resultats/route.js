// app/api/stats/route.js
import { getSqlPool } from "@/lib/db";

export async function GET(req) {
  const url  = new URL(req.url);
  const y1   = parseInt(url.searchParams.get("y1") ?? "2019", 10);
  const y2   = parseInt(url.searchParams.get("y2") ?? "2024", 10);

  try {
    const pool = await getSqlPool();

    // helper pour exécuter une SP et renvoyer la 1re ligne de résultat
    const exec = async (name) => {
      const r = await pool.request()
        .input("y1", y1)
        .input("y2", y2)
        .execute(name);            
      return r.recordset;          
    };

    const tempYear     = await exec("dbo.usp_AnneePlusEtMoinsChaude");
    const tempProv     = await exec("dbo.usp_ProvincePlusEtMoinsChaude");
    const precipYear   = await exec("dbo.usp_AnneePlusEtMoinsPluvieuse");
    const precipProv   = await exec("dbo.usp_ProvincePlusEtMoinsPluvieuse");
    const co2Year      = await exec("dbo.usp_AnneePlusEtMoinsPolluee");
    const co2Prov      = await exec("dbo.usp_ProvincePlusEtMoinsPolluee");

    return Response.json({
      period: { y1, y2 },
      temperature: {
        year: tempYear,                
        province: tempProv              
      },
      precipitation: {
        year: precipYear,               
        province: precipProv
      },
      co2: {
        year: co2Year,                  
        province: co2Prov
      }
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

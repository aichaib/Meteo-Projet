import fetch from "node-fetch";
import sql   from "mssql";
import "dotenv/config";

const YEARS = [2019,2020,2021,2022,2023,2024];

async function main() {
  const pool = await sql.connect({
    user:     process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    server:   process.env.AZURE_SQL_HOST,
    database: process.env.AZURE_SQL_DATABASE,
    options:  { encrypt: true }
  });

  const idSrc = await pool.request()
      .query`SELECT id_source FROM Source WHERE nom LIKE 'Open-Meteo%'`
      .then(r => r.recordset[0].id_source);

  // Récupère toutes les stations OpenMeteo avec leurs coords
  const stations = await pool.request()
      .query`SELECT id_station, fk_id_province, latitude, longitude FROM Station WHERE nom LIKE 'OpenMeteo_%'`
      .then(r => r.recordset);

  for (const st of stations) {
    for (const year of YEARS) {
      const url =
        `https://archive-api.open-meteo.com/v1/archive?latitude=${st.latitude}&longitude=${st.longitude}` +
        `&start_date=${year}-01-01&end_date=${year}-12-31` +
        `&daily=temperature_2m_mean,precipitation_sum&timezone=auto`;

      const j   = await fetch(url).then(r => r.json());
      const T   = j.daily.temperature_2m_mean.reduce((a,b)=>a+b) / j.daily.time.length;
      const P   = j.daily.precipitation_sum .reduce((a,b)=>a+b) / j.daily.time.length;
      const idA = await pool.request().input('y',year)
                    .query`SELECT id_annee FROM Annee WHERE annee=@y`
                    .then(r=>r.recordset[0].id_annee);

      await pool.request()
        .input('prov', st.fk_id_province)
        .input('stat', st.id_station)
        .input('annee', idA)
        .input('src',  idSrc)
        .input('temp', +T.toFixed(2))
        .input('prec', +P.toFixed(2))
        .query(`
          MERGE Fait_Meteo AS F
          USING (SELECT @prov AS p, @stat AS s, @annee AS a, @src AS src) v
          ON  F.fk_id_province = v.p
          AND F.fk_id_station  = v.s
          AND F.fk_id_annee    = v.a
          AND F.fk_id_source   = v.src
          WHEN MATCHED THEN
              UPDATE SET temperature_moy = @temp,
                         precipitation_moy = @prec
          WHEN NOT MATCHED THEN
              INSERT (fk_id_province,fk_id_station,fk_id_annee,fk_id_source,temperature_moy,precipitation_moy)
              VALUES (@prov,@stat,@annee,@src,@temp,@prec);`);
      console.log(`✅ ${year} ${st.id_station}`);
    }
  }
  console.log('FIN ETL Open-Meteo');
  pool.close();
}

main().catch(err => { console.error(err); process.exit(1); });

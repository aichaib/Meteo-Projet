// scripts/etl_co2_xlsx.cjs
require("dotenv").config();
const sql  = require("mssql");
const XLSX = require("xlsx");
const path = require("path");

const FILE        = process.argv[2] || "data/ghg-emissions-regional-en.xlsx";
const SOURCE_NAME = process.argv[3] || "ECCC – NIR/CESI (XLSX 2019–2023)";
const YEARS = new Set([2019, 2020, 2021, 2022, 2023]);

async function getPool() {
  return sql.connect({
    user:     process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    server:   process.env.AZURE_SQL_HOST,
    database: process.env.AZURE_SQL_DATABASE,
    port:     1433,
    options: { encrypt: true, trustServerCertificate: false }
  });
}

const NAME2CODE = {
  "Newfoundland and Labrador": "NL",
  "Prince Edward Island": "PE",
  "Nova Scotia": "NS",
  "New Brunswick": "NB",
  "Quebec": "QC", "Québec": "QC",
  "Ontario": "ON", "Manitoba": "MB", "Saskatchewan": "SK", "Alberta": "AB",
  "British Columbia": "BC", "Colombie-Britannique": "BC",
  "Yukon": "YT", "Northwest Territories": "NT", "Territoires du Nord-Ouest": "NT",
  "Nunavut": "NU"
};

function cleanProv(raw) {
  if (!raw) return "";
  return String(raw).trim().replace(/\[[^\]]+\]/g, "").replace(/\s+/g, " ");
}
function getCodeFromCell(cell) {
  const s = cleanProv(cell);
  const m = s.match(/\(([A-Z]{2})\)\s*$/);        // ex: "Nunavut (NU)"
  if (m) return m[1];
  const nameOnly = s.replace(/\s*\([A-Z]{2}\)\s*$/, "");
  return NAME2CODE[nameOnly] || NAME2CODE[s] || null;
}
function toNum(x) {
  if (x === null || x === undefined || x === "") return null;
  const n = Number(String(x).replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : null;
}

(async function main(){
  const wb   = XLSX.readFile(path.resolve(FILE));
  const ws   = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });

  const headerRowIdx = rows.findIndex(r =>
    r?.some?.(c => typeof c === "string" && c.toLowerCase().includes("province or territory"))
  );
  if (headerRowIdx < 0) throw new Error("Header 'Province or territory' not found.");

  const header  = rows[headerRowIdx].map(c => (c ? String(c) : ""));
  const provCol = header.findIndex(h => h.toLowerCase().includes("province or territory"));
  const yearCol = {};
  header.forEach((h, i) => { const m = h.match(/\b(2019|2020|2021|2022|2023)\b/); if (m) yearCol[+m[1]] = i; });

  const pool = await getPool();

  const idSrc = await pool.request()
    .input("n", sql.VarChar, SOURCE_NAME)
    .query(`
      MERGE Source AS s
      USING (SELECT @n AS nom) v
      ON s.nom = v.nom
      WHEN NOT MATCHED THEN INSERT(nom) VALUES(v.nom)
      OUTPUT inserted.id_source;
    `).then(r => r.recordset[0].id_source);

  const provMap = new Map((await pool.request().query`SELECT code,id_province FROM Province`).recordset.map(r => [r.code, r.id_province]));
  const yearMap = new Map((await pool.request().query`SELECT annee,id_annee FROM Annee`).recordset.map(r => [r.annee, r.id_annee]));

  let upserts = 0, skipped = 0;

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    const first = (row?.[provCol] ?? "").toString();
    if (!first || /^note:/i.test(first) || /^source:/i.test(first)) break;

    const code = getCodeFromCell(first);
    const idP  = code ? provMap.get(code) : null;
    if (!idP) { skipped++; continue; }

    for (const y of Object.keys(yearCol).map(Number)) {
      if (!YEARS.has(y)) continue;
      const val = toNum(row[yearCol[y]]);
      const idA = yearMap.get(y);
      if (!Number.isFinite(val) || !idA) { skipped++; continue; }

      await pool.request()
        .input("p", idP).input("a", idA).input("s", idSrc)
        .input("v", Number(val.toFixed(2)))
        .query(`
          MERGE Fait_Meteo AS F
          USING (SELECT @p AS p, @a AS a, @s AS s) v
          ON  F.fk_id_province = v.p
          AND F.fk_id_annee    = v.a
          AND F.fk_id_source   = v.s
          AND F.fk_id_station IS NULL
          WHEN MATCHED THEN
            UPDATE SET co2_moy_mt = @v
          WHEN NOT MATCHED THEN
            INSERT (fk_id_province,fk_id_station,fk_id_annee,fk_id_source,co2_moy_mt)
            VALUES (@p, NULL, @a, @s, @v);
        `);
      upserts++;
    }
  }

  console.log(`✅ Import CO₂ terminé (upserts=${upserts}, skipped=${skipped})`);
  await pool.close();
})().catch(e => { console.error(e); process.exit(1); });

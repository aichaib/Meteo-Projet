import { getSqlPool } from "@/lib/db";

// Récupère les données météo ou les années
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Données de secours si la DB plante
    const anneesTest = [
      { annee: 2024 },
      { annee: 2023 },
      { annee: 2022 },
      { annee: 2021 },
      { annee: 2020 },
      { annee: 2019 }
    ];
    
    // Récupère juste les années
    if (type === 'annees') {
      try {
        const pool = await getSqlPool();
        const result = await pool.request().query(`
          SELECT DISTINCT annee 
          FROM Annee 
          ORDER BY annee DESC
        `);
        
        console.log('Années récupérées de la base de données');
        return Response.json(result.recordset);
      } catch (dbError) {
        console.error('Erreur de connexion à la base de données:', dbError);
        console.log('Utilisation des années de test');
        return Response.json(anneesTest);
      }
    }
    
    // Récupère toutes les données météo
    try {
      const pool = await getSqlPool();
      const result = await pool.request().query(`
        SELECT TOP 100 
          p.code AS province_code,
          p.nom AS province_nom,
          s.nom AS station,
          a.annee,
          f.temperature_moy,
          f.precipitation_moy,
          f.co2_moy_mt
        FROM Fait_Meteo f
        JOIN Province p ON f.fk_id_province = p.id_province
        JOIN Station s ON f.fk_id_station = s.id_station
        JOIN Annee a ON f.fk_id_annee = a.id_annee
        ORDER BY a.annee DESC
      `);
      
      return Response.json(result.recordset);
    } catch (dbError) {
      console.error('Erreur de connexion à la base de données:', dbError);
      return Response.json([]);
    }
    
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

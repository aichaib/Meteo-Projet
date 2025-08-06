import { getSqlPool } from "@/lib/db";

// Récupère les données de précipitations avec filtres
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const province = searchParams.get('province');
    const annee = searchParams.get('annee');
    
    // Données de secours si la DB plante
    const precipitationsTest = [
      {
        province_code: 'AB',
        province_nom: 'Alberta',
        station: 'EDMONTON INTERNATIONAL CS',
        annee: 2024,
        precipitation_moy: 0.86,
        temperature_moy: 3.02
      },
      {
        province_code: 'BC',
        province_nom: 'Colombie-Britannique',
        station: 'VANCOUVER INTL A',
        annee: 2024,
        precipitation_moy: 3.75,
        temperature_moy: 10.74
      },
      {
        province_code: 'QC',
        province_nom: 'Québec',
        station: 'QUEBEC/JEAN LESAGE INTL',
        annee: 2024,
        precipitation_moy: 2.86,
        temperature_moy: 6.46
      },
      {
        province_code: 'ON',
        province_nom: 'Ontario',
        station: 'TORONTO PEARSON INTL',
        annee: 2024,
        precipitation_moy: 2.45,
        temperature_moy: 8.12
      },
      {
        province_code: 'MB',
        province_nom: 'Manitoba',
        station: 'WINNIPEG INTL A',
        annee: 2024,
        precipitation_moy: 1.92,
        temperature_moy: 2.34
      },
      {
        province_code: 'SK',
        province_nom: 'Saskatchewan',
        station: 'SASKATOON INTL A',
        annee: 2024,
        precipitation_moy: 1.56,
        temperature_moy: 1.89
      },
      {
        province_code: 'NS',
        province_nom: 'Nouvelle-Écosse',
        station: 'HALIFAX STANFIELD INTL',
        annee: 2024,
        precipitation_moy: 4.23,
        temperature_moy: 7.89
      },
      {
        province_code: 'NB',
        province_nom: 'Nouveau-Brunswick',
        station: 'FREDERICTON A',
        annee: 2024,
        precipitation_moy: 3.67,
        temperature_moy: 6.45
      },
      {
        province_code: 'PE',
        province_nom: 'Île-du-Prince-Édouard',
        station: 'CHARLOTTETOWN A',
        annee: 2024,
        precipitation_moy: 3.12,
        temperature_moy: 5.78
      },
      {
        province_code: 'NL',
        province_nom: 'Terre-Neuve-et-Labrador',
        station: 'ST JOHN\'S INTL A',
        annee: 2024,
        precipitation_moy: 4.89,
        temperature_moy: 4.23
      },
      {
        province_code: 'YT',
        province_nom: 'Yukon',
        station: 'WHITEHORSE A',
        annee: 2024,
        precipitation_moy: 0.45,
        temperature_moy: -2.34
      },
      {
        province_code: 'NT',
        province_nom: 'Territoires du Nord-Ouest',
        station: 'YELLOWKNIFE A',
        annee: 2024,
        precipitation_moy: 0.23,
        temperature_moy: -5.67
      },
      {
        province_code: 'NU',
        province_nom: 'Nunavut',
        station: 'IQALUIT A',
        annee: 2024,
        precipitation_moy: 0.12,
        temperature_moy: -8.91
      }
    ];
    
    // Essaie de récupérer depuis la DB
    try {
      const pool = await getSqlPool();
      let query = `
        SELECT 
          p.code AS province_code,
          p.nom AS province_nom,
          s.nom AS station,
          a.annee,
          f.precipitation_moy,
          f.temperature_moy
        FROM Fait_Meteo f
        JOIN Province p ON f.fk_id_province = p.id_province
        JOIN Station s ON f.fk_id_station = s.id_station
        JOIN Annee a ON f.fk_id_annee = a.id_annee
        WHERE f.precipitation_moy IS NOT NULL
      `;
      
      const params = [];
      
      // Ajoute les filtres si spécifiés
      if (province && province !== 'toutes') {
        query += ` AND p.code = @province`;
        params.push({ name: 'province', value: province });
      }
      
      if (annee && annee !== 'toutes') {
        query += ` AND a.annee = @annee`;
        params.push({ name: 'annee', value: parseInt(annee) });
      }
      
      query += ` ORDER BY p.code, a.annee`;
      
      const request = pool.request();
      params.forEach(param => {
        request.input(param.name, param.value);
      });
      
      const result = await request.query(query);
      console.log('Données de précipitations récupérées de la base de données');
      return Response.json(result.recordset);
    } catch (dbError) {
      console.error('Erreur de connexion à la base de données:', dbError);
      console.log('Utilisation des données de test');
      
      // Filtre les données de test selon les paramètres
      let filteredData = precipitationsTest;
      
      if (province && province !== 'toutes') {
        filteredData = filteredData.filter(item => item.province_code === province);
      }
      
      if (annee && annee !== 'toutes') {
        filteredData = filteredData.filter(item => item.annee === parseInt(annee));
      }
      
      return Response.json(filteredData);
    }
    
  } catch (error) {
    console.error('Erreur lors de la récupération des précipitations:', error);
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 
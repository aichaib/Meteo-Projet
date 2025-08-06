import { getSqlPool } from "@/lib/db";

// Liste toutes les provinces
export async function GET() {
  try {
    // Données de secours si la DB plante
    const provincesTest = [
      { code: 'AB', nom: 'Alberta' },
      { code: 'BC', nom: 'Colombie-Britannique' },
      { code: 'MB', nom: 'Manitoba' },
      { code: 'NB', nom: 'Nouveau-Brunswick' },
      { code: 'NL', nom: 'Terre-Neuve-et-Labrador' },
      { code: 'NS', nom: 'Nouvelle-Écosse' },
      { code: 'NT', nom: 'Territoires du Nord-Ouest' },
      { code: 'NU', nom: 'Nunavut' },
      { code: 'ON', nom: 'Ontario' },
      { code: 'PE', nom: 'Île-du-Prince-Édouard' },
      { code: 'QC', nom: 'Québec' },
      { code: 'SK', nom: 'Saskatchewan' },
      { code: 'YT', nom: 'Yukon' }
    ];

    // Essaie de récupérer depuis la DB
    try {
      const pool = await getSqlPool();
      const result = await pool.request().query(`
        SELECT DISTINCT p.code, p.nom
        FROM Province p
        ORDER BY p.code
      `);
      
      console.log('Données de la base de données récupérées avec succès');
      return Response.json(result.recordset);
    } catch (dbError) {
      console.error('Erreur de connexion à la base de données:', dbError);
      console.log('Utilisation des données de test');
      return Response.json(provincesTest);
    }
    
  } catch (error) {
    console.error('Erreur lors de la récupération des provinces:', error);
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

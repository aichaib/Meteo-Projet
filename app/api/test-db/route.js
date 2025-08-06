import { getSqlPool } from "@/lib/db";

export async function GET() {
  try {
    console.log('Test de connexion à la base de données...');
    
    const pool = await getSqlPool();
    console.log('Pool de connexion créé avec succès');
    
    // Test simple pour vérifier la connexion
    const result = await pool.request().query('SELECT 1 as test');
    console.log('Requête de test réussie:', result.recordset);
    
    // Test de la table Province
    const provincesResult = await pool.request().query('SELECT TOP 5 * FROM Province');
    console.log('Provinces trouvées:', provincesResult.recordset);
    
    return Response.json({
      success: true,
      message: 'Connexion à la base de données réussie',
      test: result.recordset[0],
      provinces: provincesResult.recordset
    });
    
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 
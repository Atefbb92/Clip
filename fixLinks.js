const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://neondb_owner:vPjR0rVlqf5H@ep-crimson-rain-agmpgxv8-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require' });

async function main() {
  console.log("=== Début de la réparation automatique ===");
  
  // 1. Trouver le Case le plus récent
  const cases = await pool.query('SELECT id, "patientId" FROM "Case" ORDER BY "createdAt" DESC LIMIT 1;');
  if (cases.rows.length === 0) {
    console.log("❌ Aucun Case trouvé !");
    return;
  }
  const recentCase = cases.rows[0];
  console.log(`✅ Case récent trouvé (ID: ${recentCase.id})`);

  // 2. Chercher ou créer un TPCheckVersion
  const tps = await pool.query('SELECT id FROM "TPCheckVersion" WHERE "caseId" = $1 LIMIT 1;', [recentCase.id]);
  
  if (tps.rows.length > 0) {
    const tpId = tps.rows[0].id;
    console.log(`✅ TP Check existant trouvé (ID: ${tpId})`);
    
    await pool.query(
      `UPDATE "TPCheckVersion" 
       SET message = $1, status = 'PENDING', url = 'https://pd.smileynova.com/design/?s=n2ury6ht&p=006ju475no465nu465vu46'
       WHERE id = $2;`,
      ['Ceci est le message généré automatiquement (Réparation réussie ! 🎉)', tpId]
    );
    console.log(`✅ Message mis à jour !`);
  } else {
    console.log(`⚠️ Aucun TP Check. Création en cours...`);
    const newId = 'cm' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    
    await pool.query(
      `INSERT INTO "TPCheckVersion" (id, "caseId", version, status, message, url, "updatedAt") 
       VALUES ($1, $2, 1, 'PENDING', $3, 'https://pd.smileynova.com/design/?s=n2ury6ht&p=006ju475no465nu465vu46', NOW());`,
      [newId, recentCase.id, 'Ceci est le premier message généré automatiquement (Réparation réussie ! 🎉)']
    );
    console.log(`✅ Nouveau TP Check créé (ID: ${newId})`);
  }
  
  console.log("\n✅ === RÉPARATION TERMINÉE ! ===");
}

main().catch(e => console.error(e)).finally(() => pool.end());

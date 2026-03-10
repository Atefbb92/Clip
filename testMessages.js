const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:vPjR0rVlqf5H@ep-crimson-rain-agmpgxv8-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function main() {
  const cases = await pool.query('SELECT id, "patientId" FROM "Case" ORDER BY "createdAt" DESC LIMIT 1;');
  console.log("Latest Case:", cases.rows[0]);
  
  if (cases.rows.length > 0) {
    const caseId = cases.rows[0].id;
    const tps = await pool.query('SELECT id, "caseId", message FROM "TPCheckVersion" WHERE "caseId" = $1;', [caseId]);
    console.log("TP Checks for latest case:", tps.rows);
    
    for (const tp of tps.rows) {
      const msgs = await pool.query('SELECT id, "tpCheckId", text FROM "TPCheckMessage" WHERE "tpCheckId" = $1;', [tp.id]);
      console.log(`Messages for TP ${tp.id}:`, msgs.rows);
    }
  }
}

main().catch(console.error).finally(() => pool.end());

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Debugging ke liye check kar rahe hain ki URL load hua ya nahi
console.log("Checking DB URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runIngest() {
  const targetFolder = process.env.DATA_DIR || path.join(process.cwd(), 'data', 'sample_a');
  console.log(`🚀 Starting execution: ${targetFolder}`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Tables clear karo taaki purana data clash na kare
    await client.query('TRUNCATE transactions, fund_nav, holdings, funds CASCADE');

    // 2. Data load karo
    const txPath = path.join(targetFolder, 'transactions.json');
    if (fs.existsSync(txPath)) {
      const rawTx = JSON.parse(fs.readFileSync(txPath, 'utf8'));
      for (const tx of rawTx) {
        await client.query(
          `INSERT INTO transactions (id, date, merchant, category, amount, currency, memo) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
          [tx.id, tx.date, tx.merchant, tx.category, tx.amount, tx.currency, tx.memo]
        );
      }
    }

    const fundsPath = path.join(targetFolder, 'funds.json');
    if (fs.existsSync(fundsPath)) {
      const rawFunds = JSON.parse(fs.readFileSync(fundsPath, 'utf8'));
      for (const f of rawFunds) {
        await client.query(
          `INSERT INTO funds (id, name, category) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
          [f.id, f.name, f.category]
        );
        if (f.nav_history) {
          for (const [dateStr, navVal] of Object.entries(f.nav_history)) {
            await client.query(`INSERT INTO fund_nav (fund_id, date, nav) VALUES ($1, $2, $3)`, [f.id, dateStr, navVal]);
          }
        }
      }
    }

    await client.query('COMMIT');
    console.log(`🎉 Ingestion successful!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}
runIngest();
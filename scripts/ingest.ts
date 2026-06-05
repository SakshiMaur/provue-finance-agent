import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/finance_agent',
});

async function runIngest() {
  
  const targetFolder = process.env.DATA_DIR || path.join(process.cwd(), 'data', 'sample_a');
  console.log(`🚀 Starting execution sequence for target directory: ${targetFolder}`);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(50) PRIMARY KEY,
        date DATE NOT NULL,
        merchant VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount NUMERIC(15,2) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        memo TEXT
      );

      CREATE TABLE IF NOT EXISTS funds (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS fund_nav (
        id SERIAL PRIMARY KEY,
        fund_id VARCHAR(50) REFERENCES funds(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        nav NUMERIC(15,4) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS holdings (
        fund_id VARCHAR(50) PRIMARY KEY,
        fund_name VARCHAR(255) NOT NULL,
        units NUMERIC(15,4) NOT NULL,
        purchase_date DATE NOT NULL,
        purchase_nav NUMERIC(15,4) NOT NULL
      );
    `);

    
    await client.query('TRUNCATE transactions, fund_nav, holdings, funds CASCADE');

    if (!fs.existsSync(targetFolder)) {
      throw new Error(`Target path snapshot directory target is invalid: ${targetFolder}`);
    }

    
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

        if (f.nav_history && typeof f.nav_history === 'object') {
          for (const [dateStr, navVal] of Object.entries(f.nav_history)) {
            await client.query(
              `INSERT INTO fund_nav (fund_id, date, nav) VALUES ($1, $2, $3)`,
              [f.id, dateStr, navVal]
            );
          }
        }
      }
    }

    
    const holdingsPath = path.join(targetFolder, 'holdings.json');
    if (fs.existsSync(holdingsPath)) {
      const rawHoldings = JSON.parse(fs.readFileSync(holdingsPath, 'utf8'));
      for (const h of rawHoldings) {
        await client.query(
          `INSERT INTO holdings (fund_id, fund_name, units, purchase_date, purchase_nav) 
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT (fund_id) DO NOTHING`,
          [h.fund_id, h.fund_name, h.units, h.purchase_date, h.purchase_nav]
        );
      }
    }

    await client.query('COMMIT');
    console.log(`🎉 Ingestion sequence parsing completed cleanly for data array target context!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Database parsing step failed sequence aborting:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runIngest();
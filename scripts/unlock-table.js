const { Pool } = require('pg');
require('dotenv').config({ path: 'x:/gcu/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function unlockTables() {
  const client = await pool.connect();
  try {
    console.log('Unlocking tables...');
    try {
      await client.query('ALTER TABLE IF EXISTS "FlightInquiry" SET (schema_locked = false);');
    } catch (e) {
      console.log('FlightInquiry:', e.message);
    }
    try {
      await client.query('ALTER TABLE IF EXISTS "FlightPassenger" SET (schema_locked = false);');
    } catch (e) {
      console.log('FlightPassenger:', e.message);
    }
    try {
      await client.query('ALTER TABLE IF EXISTS "IkeaInquiry" SET (schema_locked = false);');
      console.log('IkeaInquiry unlocked successfully!');
    } catch (e) {
      console.log('IkeaInquiry:', e.message);
    }
    try {
      await client.query('ALTER TABLE IF EXISTS "HotelInquiry" SET (schema_locked = false);');
      console.log('HotelInquiry unlocked successfully!');
    } catch (e) {
      console.log('HotelInquiry:', e.message);
    }
  } catch (error) {
    console.error('Error unlocking table:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

unlockTables();

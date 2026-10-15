const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function unlockTables() {
  const client = await pool.connect();
  try {
    console.log('Unlocking FlightInquiry schema...');
    await client.query('ALTER TABLE "FlightInquiry" SET (schema_locked = false);');
    console.log('FlightInquiry unlocked successfully!');

    // Check if FlightPassenger is also locked or any other table
    try {
      await client.query('ALTER TABLE "FlightPassenger" SET (schema_locked = false);');
      console.log('FlightPassenger unlocked successfully!');
    } catch (e) {
      console.log('FlightPassenger unlock info:', e.message);
    }
  } catch (error) {
    console.error('Error unlocking table:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

unlockTables();

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
    const tables = [
      'FlightInquiry',
      'FlightPassenger',
      'IkeaInquiry',
      'HotelInquiry',
      'NavbarLink',
      'Blog',
      'User',
      'PopupNotification',
      'MarqueeMessage',
      'SiteSettings',
      'SeoSettings'
    ];

    for (const table of tables) {
      try {
        await client.query(`ALTER TABLE IF EXISTS "${table}" SET (schema_locked = false);`);
        console.log(`${table} unlocked successfully!`);
      } catch (e) {
        console.log(`${table}:`, e.message);
      }
    }
  } catch (error) {
    console.error('Error unlocking table:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

unlockTables();

const pool = require('./db');

async function getVisitors() {
  try {
    const result = await pool.query('SELECT * FROM m_visitors_signup LIMIT 5');
    console.log('Visitor accounts:');
    if (result.rows.length === 0) {
      console.log('No visitors found in database');
    } else {
      result.rows.forEach((row, i) => {
        console.log(`\n--- Visitor ${i + 1} ---`);
        console.log(row);
      });
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

getVisitors();

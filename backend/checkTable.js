const pool = require('./db');

async function checkWalkinsTable() {
  try {
    // Check existing columns
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'walkins'
      ORDER BY ordinal_position
    `);
    console.log('Existing walkins columns:');
    console.log(columns.rows);
    
    // Add missing columns if they don't exist
    const missingColumns = [
      { name: 'appointment_date', type: 'DATE' },
      { name: 'time_slot', type: 'VARCHAR(10)' },
      { name: 'is_walkin', type: 'BOOLEAN DEFAULT true' },
      { name: 'booked_by', type: 'VARCHAR(100)' },
      { name: 'insert_by', type: 'VARCHAR(50)' }
    ];
    
    const existingCols = columns.rows.map(c => c.column_name);
    
    for (const col of missingColumns) {
      if (!existingCols.includes(col.name)) {
        await pool.query(`ALTER TABLE walkins ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
        console.log(`Added column: ${col.name}`);
      }
    }
    
    console.log('\nTable structure verified');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkWalkinsTable();

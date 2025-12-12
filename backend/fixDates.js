const pool = require('./db');

async function updateDates() {
  try {
    // Use CURRENT_DATE directly in SQL to avoid timezone issues
    console.log('Updating appointments to CURRENT_DATE');
    
    // Update appointments to today's date
    const result = await pool.query(
      `UPDATE appointments SET appointment_date = CURRENT_DATE WHERE appointment_id IN ('APT201', 'APT202', 'APT203', 'APT204', 'APT205')`
    );
    console.log('Updated', result.rowCount, 'appointments');
    
    // Also reset some statuses for testing
    await pool.query(`UPDATE appointments SET status = 'pending' WHERE appointment_id IN ('APT201', 'APT202', 'APT204')`);
    await pool.query(`UPDATE appointments SET status = 'approved' WHERE appointment_id = 'APT203'`);
    await pool.query(`UPDATE appointments SET status = 'completed' WHERE appointment_id = 'APT205'`);
    console.log('Reset statuses');
    
    // Verify the update
    const check = await pool.query(
      `SELECT appointment_id, appointment_date, status FROM appointments WHERE officer_id = 'OFF001' ORDER BY appointment_id`
    );
    console.log('Appointments:', check.rows);
    
    process.exit();
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

updateDates();

const pool = require('./db');
const bcrypt = require('bcrypt');

async function setup() {
  try {
    // 1. Reset officer password
    const hash = await bcrypt.hash('officer123', 10);
    await pool.query('UPDATE m_users SET password_hash = $1 WHERE username = $2', [hash, 'OFF001']);
    console.log('✅ Password reset for OFF001 to: officer123');

    // 2. Update appointments to today's date
    await pool.query(`
      UPDATE appointments 
      SET appointment_date = CURRENT_DATE 
      WHERE appointment_id IN ('APT201', 'APT202', 'APT203', 'APT204', 'APT205')
    `);
    console.log('✅ Updated appointments to today');

    // 3. Reset statuses
    await pool.query(`UPDATE appointments SET status = 'pending' WHERE appointment_id IN ('APT201', 'APT202', 'APT204')`);
    await pool.query(`UPDATE appointments SET status = 'approved' WHERE appointment_id = 'APT203'`);
    await pool.query(`UPDATE appointments SET status = 'completed' WHERE appointment_id = 'APT205'`);
    console.log('✅ Reset appointment statuses');

    // 4. Verify appointments
    const result = await pool.query(`
      SELECT a.appointment_id, v.full_name, a.purpose, a.status, a.appointment_date, a.slot_time
      FROM appointments a
      JOIN m_visitors_signup v ON a.visitor_id = v.visitor_id
      WHERE a.officer_id = 'OFF001' AND DATE(a.appointment_date) = CURRENT_DATE
      ORDER BY a.slot_time
    `);
    console.log('✅ Today\'s appointments for OFF001:');
    console.table(result.rows);

    // 5. Test login
    const user = await pool.query('SELECT username, password_hash FROM m_users WHERE username = $1', ['OFF001']);
    const isMatch = await bcrypt.compare('officer123', user.rows[0].password_hash);
    console.log('✅ Password verification:', isMatch ? 'SUCCESS' : 'FAILED');

    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e);
    process.exit(1);
  }
}

setup();

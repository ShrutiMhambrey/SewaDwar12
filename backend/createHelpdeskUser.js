const pool = require('./db');
const bcrypt = require('bcrypt');

async function createHelpdeskUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('helpdesk123', 10);
    const userId = 'HD001';
    
    // Check if user exists in m_users
    const existingUser = await pool.query(`SELECT * FROM m_users WHERE user_id = $1`, [userId]);
    
    if (existingUser.rows.length === 0) {
      // Create user in m_users first (role_code max 2 chars)
      await pool.query(`
        INSERT INTO m_users (user_id, username, password_hash, role_code, is_active, insert_date)
        VALUES ($1, $2, $3, 'HD', true, NOW())
      `, [userId, 'helpdesk1', hashedPassword]);
      console.log('Created user in m_users');
    } else {
      // Update password
      await pool.query(`UPDATE m_users SET password_hash = $1 WHERE user_id = $2`, [hashedPassword, userId]);
      console.log('Updated user password in m_users');
    }
    
    // Check if helpdesk entry exists
    const existingHelpdesk = await pool.query(`SELECT * FROM m_helpdesk WHERE user_id = $1`, [userId]);
    
    if (existingHelpdesk.rows.length === 0) {
      // Create helpdesk entry
      await pool.query(`
        INSERT INTO m_helpdesk (helpdesk_id, user_id, full_name, email_id, is_active, insert_date)
        VALUES ($1, $2, $3, $4, true, NOW())
      `, ['01', userId, 'Helpdesk User', 'helpdesk@sewadwaar.com']);
      console.log('Created helpdesk entry');
    } else {
      console.log('Helpdesk entry already exists');
    }
    
    console.log('\n=== Helpdesk Login Credentials ===');
    console.log('Username: helpdesk1');
    console.log('Password: helpdesk123');
    console.log('==================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createHelpdeskUser();

const pool = require('./db');

async function checkHelpdeskUser() {
  try {
    // Check m_users for HD001
    const users = await pool.query(
      "SELECT user_id, username, password_hash, role_code FROM m_users WHERE user_id = 'HD001'"
    );
    console.log('HD001 User:', users.rows);

    // Check all helpdesk users
    const hdUsers = await pool.query(
      "SELECT user_id, username FROM m_users WHERE role_code = 'HD'"
    );
    console.log('All HD Users:', hdUsers.rows);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkHelpdeskUser();

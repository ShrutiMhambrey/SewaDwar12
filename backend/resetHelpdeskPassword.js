const pool = require('./db');
const bcrypt = require('bcrypt');

async function resetHelpdeskPassword() {
  try {
    const newPassword = 'helpdesk123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await pool.query(
      "UPDATE m_users SET password_hash = $1 WHERE user_id = 'HD001'",
      [hashedPassword]
    );
    
    console.log('✅ Password reset successful!');
    console.log('Username: helpdesk1');
    console.log('Password: helpdesk123');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

resetHelpdeskPassword();

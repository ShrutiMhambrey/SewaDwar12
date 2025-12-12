const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error acquiring client', err.stack);
  } else {
    console.log('✅ Database connected successfully!');
    // you can run a test query
    client.query('SELECT NOW()', (err, result) => {
      release(); // release back to pool
      if (err) {
        console.error('❌ Error running query', err.stack);
      } else {
        console.log('📅 Current time from DB:', result.rows[0]);
      }
    });
  }
});

async function registerOfficer() {
  const plainPassword = "Officer@123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10); // 10 salt rounds

  const result = await pool.query(
    `SELECT * FROM register_user_by_role(
      $1,  -- p_password_hash
      $2,  -- p_full_name
      $3,  -- p_mobile_no
      $4,  -- p_email_id
      $5,  -- p_designation_code
      $6,  -- p_department_id
      $7,  -- p_organization_id
      $8,  -- p_state_code
      $9,  -- p_division_code
      $10, -- p_district_code
      $11, -- p_taluka_code
      $12, -- p_photo
      $13  -- p_role_code  ('OF' = Officer)
    )`,
    [
      hashedPassword,
      "Test Officer",
      "9876543210",
      "officer@example.com",
      "DES01",   // designation_code must exist
      "DEP001",  // department_id must exist
      "ORG001",  // organization_id must exist
      "27",      // Maharashtra
      "01",      // division
      "482",     // district
      null,      // taluka_code (optional now)
      null,      // photo
      "OF"       // role_code = Officer
    ]
  );

  console.log(result.rows[0]); // out_user_id, out_entity_id, message
}

registerOfficer().catch(console.error);

module.exports = pool;

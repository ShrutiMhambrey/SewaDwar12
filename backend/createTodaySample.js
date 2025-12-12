const pool = require('./db');

async function createSampleAppointments() {
  try {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    console.log('Creating appointments for:', today);
    
    // Delete old sample appointments first
    await pool.query("DELETE FROM appointments WHERE appointment_id LIKE 'APT30%'");
    console.log('Deleted old APT30x appointments');
    
    // Insert sample appointments for today
    const appointments = [
      { id: 'APT301', visitor: 'VIS001', time: '09:00:00', status: 'pending', purpose: 'Property Tax Query' },
      { id: 'APT302', visitor: 'VIS002', time: '09:30:00', status: 'pending', purpose: 'Birth Certificate Application' },
      { id: 'APT303', visitor: 'VIS001', time: '10:00:00', status: 'approved', purpose: 'Marriage Certificate Request' },
      { id: 'APT304', visitor: 'VIS002', time: '10:30:00', status: 'pending', purpose: 'Water Connection Application' },
      { id: 'APT305', visitor: 'VIS001', time: '11:00:00', status: 'rescheduled', purpose: 'Land Record Verification' },
      { id: 'APT306', visitor: 'VIS002', time: '11:30:00', status: 'pending', purpose: 'Income Certificate Request' },
      { id: 'APT307', visitor: 'VIS001', time: '14:00:00', status: 'approved', purpose: 'Driving License Renewal' },
      { id: 'APT308', visitor: 'VIS002', time: '14:30:00', status: 'completed', purpose: 'Ration Card Update' },
    ];
    
    for (const apt of appointments) {
      await pool.query(
        `INSERT INTO appointments (appointment_id, visitor_id, officer_id, department_id, organization_id, service_id, appointment_date, slot_time, status, purpose)
         VALUES ($1, $2, 'OFF001', 'DEP001', 'ORG001', 'SRV001', $3, $4, $5, $6)
         ON CONFLICT (appointment_id) DO UPDATE SET 
           appointment_date = $3, slot_time = $4, status = $5, purpose = $6`,
        [apt.id, apt.visitor, today, apt.time, apt.status, apt.purpose]
      );
      console.log('Created:', apt.id, '-', apt.purpose, '(' + apt.status + ')');
    }
    
    // Verify
    const result = await pool.query(
      `SELECT appointment_id, visitor_id, appointment_date, slot_time, status, purpose 
       FROM appointments WHERE appointment_date = $1 AND officer_id = 'OFF001' 
       ORDER BY slot_time`,
      [today]
    );
    
    console.log('\n✅ Total appointments for today:', result.rows.length);
    console.table(result.rows);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createSampleAppointments();

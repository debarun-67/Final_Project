const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
    console.log('🚀 Starting database seed...');

    const users = [
        { email: 'doctor1@hospital.org', password: 'password123', role: 'doctor', doctor_id: 'DOC-2025-01' },
        { email: 'patient1@patient.org', password: 'password123', role: 'patient', patient_id: 'PAT-2025-99' }
    ];

    try {
        // 1. Get all existing users to check if they exist
        const { data: userData, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
            console.error('❌ Error listing users:', listError.message);
            return;
        }

        const existingUsers = userData.users;

        for (const u of users) {
            console.log(`\nProcessing user: ${u.email}...`);
            
            let userId;
            const found = existingUsers.find(user => user.email === u.email);

            if (found) {
                console.log(`ℹ️ User ${u.email} already exists in Auth system.`);
                userId = found.id;
            } else {
                console.log(`🆕 Creating new user: ${u.email}...`);
                const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                    email: u.email,
                    password: u.password,
                    email_confirm: true
                });

                if (authError) {
                    console.error(`❌ Error creating auth user: ${authError.message}`);
                    continue;
                }
                userId = authData.user.id;
            }

            // 2. Upsert profile into PostgreSQL
            console.log(`📡 Linking profile for ${u.email}...`);
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    role: u.role,
                    doctor_id: u.doctor_id || null,
                    patient_id: u.patient_id || null
                }, { onConflict: 'id' });

            if (profileError) {
                console.error(`❌ Error seeding profile: ${profileError.message}`);
                if (profileError.message.includes('schema cache')) {
                    console.log('💡 HINT: Supabase sometimes takes a minute to refresh its "schema cache" after you create a new table. Please wait 30 seconds and try again.');
                }
            } else {
                console.log(`✅ Successfully seeded profile for ${u.email}`);
            }
        }
    } catch (err) {
        console.error('🔥 Unexpected error during seeding:', err.message);
    }
    
    console.log('\n🏁 Seed process complete.');
}

seed();

const { createClient } = require('@supabase/supabase-js');

// Hardcoded for testing script only
const supabaseUrl = 'https://iwueuhuqppdpzzhbcpok.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dWV1aHVxcHBkcHp6aGJjcG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzQxNDksImV4cCI6MjA4NjY1MDE0OX0.p5W1d3mMFsAaJY49nPgdXM1bEO7FZ4gBR9gwDXZjspA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createDoctor() {
    const email = 'doctor_test@gmail.com';
    const password = 'password123';
    const cpf = '12345678900';

    console.log(`Creating Doctor user: ${email}`);

    // 1. Sign Up
    const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Dr. Teste',
                role: 'doctor'
            }
        }
    });

    if (error) {
        console.error('Signup Error:', error);
        return;
    }

    console.log('User created:', user.id);

    // 2. Wait for trigger
    await new Promise(r => setTimeout(r, 2000));

    // 3. Update profile with CPF (if not handled by trigger correctly or to ensure it)
    // The trigger sets role from metadata, but CPF needs to be set manually or via metadata if we updated the trigger.
    // The previous trigger didn't handle CPF from metadata.
    // So we need to update it manually via SQL or Client if RLS allows (Doctor can update own profile).
    // But since we are server-side script here (users can update own profile), we can use the client.

    // Actually, client 'signUp' logs us in as that user, so we have the session context.
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ cpf: cpf, role: 'doctor' }) // Ensure role is doctor
        .eq('id', user.id);

    if (updateError) {
        console.error('Update Error:', updateError);
    } else {
        console.log('✅ Profile updated with CPF and Role.');
    }
}

createDoctor();

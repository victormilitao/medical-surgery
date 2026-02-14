const { createClient } = require('@supabase/supabase-js');

// Hardcoded for testing script only
const supabaseUrl = 'https://iwueuhuqppdpzzhbcpok.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dWV1aHVxcHBkcHp6aGJjcG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzQxNDksImV4cCI6MjA4NjY1MDE0OX0.p5W1d3mMFsAaJY49nPgdXM1bEO7FZ4gBR9gwDXZjspA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLogin() {
    console.log('--- Debugging Doctor Login ---');
    const cpf = '12345678900';
    const password = 'password123';

    // 1. Lookup Email by CPF
    console.log(`1. Looking up email for CPF: ${cpf}`);
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, id, role')
        .eq('cpf', cpf)
        .single();

    if (profileError) {
        console.error('❌ Profile Lookup Error:', profileError);
        return;
    }

    if (!profile) {
        console.error('❌ No profile found for this CPF');
        return;
    }

    console.log('✅ Profile found:', profile);

    // 2. Attempt Login
    console.log(`2. Attempting login for email: ${profile.email}`);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: password
    });

    if (authError) {
        console.error('❌ Login Failed:', authError);
    } else {
        console.log('✅ Login Successful!');
        console.log('User ID:', authData.user.id);
    }
}

debugLogin();

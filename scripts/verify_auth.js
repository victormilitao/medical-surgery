const { createClient } = require('@supabase/supabase-js');

// Hardcoded for testing script only
const supabaseUrl = 'https://iwueuhuqppdpzzhbcpok.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dWV1aHVxcHBkcHp6aGJjcG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzQxNDksImV4cCI6MjA4NjY1MDE0OX0.p5W1d3mMFsAaJY49nPgdXM1bEO7FZ4gBR9gwDXZjspA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
    const email = `testuser_${Date.now()}@gmail.com`;
    const password = 'password123';

    console.log(`Attempting to sign up user: ${email}`);

    const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Test Setup User',
                role: 'patient'
            }
        }
    });

    if (error) {
        console.error('Signup Error:', error);
        return;
    }

    console.log('User created:', user.id);

    // Wait a bit for trigger
    console.log('Waiting for trigger execution...');
    await new Promise(r => setTimeout(r, 3000));

    // Check profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('Profile Fetch Error:', profileError);
    } else {
        console.log('Profile found:', profile);
        if (profile.email === email && profile.role === 'patient') {
            console.log('SUCCESS: Trigger worked correctly.');
            console.log('Profile ID:', profile.id);
        } else {
            console.error('FAILURE: Profile data mismatch.');
        }
    }
}

testAuth();

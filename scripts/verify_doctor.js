const { createClient } = require('@supabase/supabase-js');

// Hardcoded for testing script only
const supabaseUrl = 'https://iwueuhuqppdpzzhbcpok.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dWV1aHVxcHBkcHp6aGJjcG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzQxNDksImV4cCI6MjA4NjY1MDE0OX0.p5W1d3mMFsAaJY49nPgdXM1bEO7FZ4gBR9gwDXZjspA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDoctorLookup() {
    console.log('Testing Doctor Lookup by CPF...');
    const cpf = '12345678900';

    const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('cpf', cpf)
        .single();

    if (error) {
        console.error('Lookup Error:', error);
    } else {
        console.log('Result:', data);
        if (data && data.email) {
            console.log('SUCCESS: Found email for CPF.');
        } else {
            console.error('FAILURE: Email not found.');
        }
    }
}

testDoctorLookup();

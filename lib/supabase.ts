import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';
import { Database } from '../types/supabase';

const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        if (typeof window === 'undefined') return Promise.resolve(null);
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        if (typeof window === 'undefined') return Promise.resolve();
        SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        if (typeof window === 'undefined') return Promise.resolve();
        SecureStore.deleteItemAsync(key);
    },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

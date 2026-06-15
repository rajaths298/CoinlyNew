import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform, AppState } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (__DEV__ && (!supabaseUrl || !supabaseAnonKey)) {
  // Surfaced in dev so a missing mobile/.env entry is obvious rather than a
  // confusing runtime auth failure.
  console.warn(
    'Supabase env vars are missing. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to mobile/.env and restart Expo.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // AsyncStorage on native; on web the SDK uses localStorage by default.
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Keep the session token fresh only while the app is in the foreground.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

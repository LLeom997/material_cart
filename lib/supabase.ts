import { createClient } from '@supabase/supabase-js';

// Fix: Export constants to bypass protected property access issues in consumers
export const supabaseUrl = 'https://skjzrdibumjhoohaqckm.supabase.co';
export const supabaseKey = 'sb_publishable_Ev7fscU4Ofxfm-1T7ypcAw_1_-vTSB5';

export const supabase = createClient(supabaseUrl, supabaseKey);
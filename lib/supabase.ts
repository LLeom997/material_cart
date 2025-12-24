import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://skjzrdibumjhoohaqckm.supabase.co';
const supabaseKey = 'sb_publishable_Ev7fscU4Ofxfm-1T7ypcAw_1_-vTSB5';

export const supabase = createClient(supabaseUrl, supabaseKey);
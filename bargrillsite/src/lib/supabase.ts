import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yzhvnnirhvufjhzlzbgp.supabase.co';
const supabaseAnonKey = 'sb_publishable_YRG0iPqa4Hz3yzjhezkW8g_dQwddST2';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

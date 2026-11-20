import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cmajlotutqpjppvjzqgw.supabase.co'
const supabaseKey = 'sb_publishable_jmc8VPg0Hl6ZRlDZrP2gtw_hrBoHs_j'
export const supabase = createClient(supabaseUrl, supabaseKey)
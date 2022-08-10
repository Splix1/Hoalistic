const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_PUBLIC_KEY = process.env.REACT_APP_SUPABASE_PUBLIC_KEY;
const SUPABASE_SERVICE_KEY = process.env.REACT_APP_SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

module.exports = supabase;

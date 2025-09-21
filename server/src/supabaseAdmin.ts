import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase URL and Service Key must be provdied.");
}

export const supabaseAdmin = createClient(supabaseUrl, serviceKey);
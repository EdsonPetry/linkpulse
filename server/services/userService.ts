import { supabase } from "../src/supabaseClient";

export async function createUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        throw new Error(error.message);
    }

    return data.user;
}
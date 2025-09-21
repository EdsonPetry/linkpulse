import { supabaseAdmin } from "../supabaseAdmin";

export async function createUrl(url: string, userId: string) {
    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('get_current_user_id');

    if (rpcError) {
        console.error("RPC Error:", rpcError);
    }

    console.log('--- DATABASE PERSPECTIVE ---');
    console.log('User ID from middleware:', userId);
    console.log('User ID according to auth.uid():', rpcData);
    console.log('Do they match?', userId === rpcData);

    const { data, error } = await supabaseAdmin
        .from('urls')
        .insert([
            {
                url: url,
                user_id: userId
            }
        ])
        .select()
        .single();

    if (error) {
        console.error('Error inserting URL:', error);
        throw new Error(error.message);
    }

    console.log("Successfuly inserted URL:", data);
}

export async function getUrlsByUserId(userId: string) {
    const { data, error } = await supabaseAdmin
        .from("urls")
        .select()
        .eq('user_id', userId);

    if (error) {
        console.log('Error fetching user URLs:', error);
        throw new Error(error.message);
    }

    return data;
}

export async function deleteUrl(urlId: string, userId: string) {
    const { data, error } = await supabaseAdmin
        .from("urls")
        .delete()
        .match({ id: urlId, user_id: userId });

    if (error) {
        console.log("Error deleting user URL:", error);
        throw new Error(error.message);
    }

    return data;
}
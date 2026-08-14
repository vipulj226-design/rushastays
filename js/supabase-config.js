/**
 * RUSHA STAYS — SUPABASE CONFIGURATION
 * 
 * Instructions:
 * 1. Create a free project at https://supabase.com
 * 2. In your Supabase dashboard: Project Settings -> API
 * 3. Copy "Project URL" and "Project API Key (anon/public)"
 * 4. Paste them into the SUPABASE_CONFIG object below or set them via the Admin Panel.
 * 
 * Note: The anon key is safe for public client-side use when Row Level Security (RLS) is enabled.
 */

// Safely retrieve items from localStorage handling private mode / disabled storage
function safeGetLocalStorage(key) {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem(key);
        }
    } catch (e) {
        // Storage access is restricted or disabled
    }
    return null;
}

window.SUPABASE_CONFIG = {
    // Supabase Project URL
    url: safeGetLocalStorage('rusha_supabase_url') || "https://riplmhmadmehoeizbfiu.supabase.co",
    
    // Supabase Anon/Public Key
    anonKey: safeGetLocalStorage('rusha_supabase_anon_key') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcGxtaG1hZG1laG9laXpiZml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTcwNDksImV4cCI6MjEwMTk5MzA0OX0.hphvGVMbNRcEKRoN4MKxz1dwmbGJJ3hqeKhuk23vdvY"
};

// Check if Supabase has been configured with real credentials
window.isSupabaseConfigured = function() {
    const cfg = window.SUPABASE_CONFIG;
    return cfg && 
           cfg.url && 
           cfg.anonKey && 
           !cfg.url.includes('your-project-id') && 
           !cfg.anonKey.includes('your-anon-public-key');
};

// Initialize Supabase Client instance (singleton)
window.getSupabaseClient = function() {
    if (!window.isSupabaseConfigured()) {
        return null;
    }
    
    if (window._supabaseClientInstance) {
        return window._supabaseClientInstance;
    }
    
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        try {
            window._supabaseClientInstance = supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.anonKey
            );
            return window._supabaseClientInstance;
        } catch (err) {
            console.warn('[Supabase] Init error, falling back to local data:', err);
            return null;
        }
    }
    return null;
};

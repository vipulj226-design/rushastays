/**
 * RUSHA STAYS ADMIN — SUPABASE CLIENT & AUTH GUARD
 */

const AdminAuth = {
    client: null,
    user: null,

    init() {
        if (typeof supabase !== 'undefined' && window.SUPABASE_CONFIG) {
            try {
                this.client = supabase.createClient(
                    window.SUPABASE_CONFIG.url,
                    window.SUPABASE_CONFIG.anonKey
                );
            } catch (err) {
                console.warn('[AdminAuth] Supabase init error:', err);
            }
        }
        return this.client;
    },

    getClient() {
        if (!this.client) {
            this.init();
        }
        return this.client;
    },

    async checkSession() {
        const client = this.getClient();
        if (!client) {
            return { authenticated: false, reason: 'unconfigured' };
        }

        try {
            const { data: { session }, error } = await client.auth.getSession();
            if (error || !session) {
                return { authenticated: false, reason: 'no_session' };
            }
            this.user = session.user;
            return { authenticated: true, session, user: session.user };
        } catch (err) {
            console.error('[AdminAuth] Session check failed:', err);
            return { authenticated: false, reason: 'error', error: err };
        }
    },

    async requireAuth() {
        const status = await this.checkSession();
        if (!status.authenticated) {
            // Store target redirect
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    async login(email, password) {
        const client = this.getClient();
        if (!client) {
            throw new Error('Supabase is not configured. Please set Project URL & Anon Key in Settings.');
        }

        const { data, error } = await client.auth.signInWithPassword({
            email: email.trim(),
            password: password
        });

        if (error) {
            throw error;
        }

        this.user = data.user;
        return data;
    },

    async logout() {
        const client = this.getClient();
        if (client) {
            try {
                await client.auth.signOut();
            } catch (err) {
                console.warn('[AdminAuth] Sign out error:', err);
            }
        }
        this.user = null;
        window.location.href = 'login.html';
    }
};

// Global accessor
window.AdminAuth = AdminAuth;

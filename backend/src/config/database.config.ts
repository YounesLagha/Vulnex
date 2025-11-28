// Configuration de la connexion à Supabase
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.config';
import { Database } from '../types/database.types';

// Options de configuration du client Supabase
const supabaseOptions = {
    auth: {
        // Désactiver l'auto-refresh pour le backend (géré manuellement)
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
    },
    // Configuration globale
    global: {
        headers: {
            'x-application-name': 'vulnex-backend',
        },
    },
    // Options de la base de données
    db: {
        schema: 'public',
    },
};

// Client Supabase pour les opérations publiques (avec anon key)
export const supabase: SupabaseClient<Database> = createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    supabaseOptions
);

// Client Supabase admin pour les opérations privilégiées (avec service role key)
// À utiliser uniquement pour les opérations backend qui nécessitent des privilèges élevés
export const supabaseAdmin: SupabaseClient<Database> = createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
        ...supabaseOptions,
        auth: {
            ...supabaseOptions.auth,
            // Le service role bypass les politiques RLS (Row Level Security)
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

// Fonction pour tester la connexion à la base de données
export async function testDatabaseConnection(): Promise<boolean> {
    try {
        // Tester une requête simple
        const { error } = await supabase.from('scans').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Erreur de connexion à la base de données:', error.message);
            return false;
        }

        console.log('Connexion à Supabase établie avec succès');
        return true;
    } catch (error) {
        console.error('Impossible de se connecter à Supabase:', error);
        return false;
    }
}

// Export des configurations pour réutilisation
export const databaseConfig = {
    url: env.SUPABASE_URL,
    // Ne jamais exposer les clés dans les logs ou réponses
    hasAnonKey: !!env.SUPABASE_ANON_KEY,
    hasServiceKey: !!env.SUPABASE_SERVICE_ROLE_KEY,
};

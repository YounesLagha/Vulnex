// Configuration CORS pour autoriser l'accès depuis le frontend
import { CorsOptions } from 'cors';
import { env } from './env.config';

// Liste des origines autorisées
const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:3000',    // Frontend en développement
    'http://127.0.0.1:3000',    // Variante localhost
];

// Configuration CORS complète
export const corsOptions: CorsOptions = {
    // Fonction pour vérifier si l'origine est autorisée
    origin: (origin, callback) => {
        // Permettre les requêtes sans origine (Postman, curl, applications mobiles)
        if (!origin) {
            return callback(null, true);
        }

        // Vérifier si l'origine est dans la liste autorisée
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Non autorisé par la politique CORS'));
        }
    },

    // Méthodes HTTP autorisées
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

    // Headers autorisés dans les requêtes
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],

    // Headers exposés dans les réponses
    exposedHeaders: [
        'Content-Length',
        'Content-Type',
        'X-Request-Id',
    ],

    // Autoriser l'envoi de cookies et credentials
    credentials: true,

    // Durée de mise en cache de la préflight request (24 heures)
    maxAge: 86400,

    // Permettre les requêtes preflight
    preflightContinue: false,

    // Code de statut pour les requêtes OPTIONS réussies
    optionsSuccessStatus: 204,
};

// Configuration CORS simplifiée pour le développement
export const devCorsOptions: CorsOptions = {
    origin: true,   // Autoriser toutes les origines en dev
    credentials: true,
};

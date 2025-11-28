// /backend/src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { notFoundHandler, errorHandler } from './services/error.service'; // Créer ces services plus tard
import apiRoutes from './routes/api.route'; // Route principale à créer

// --- Sécurité et Configuration de Base ---
const app = express();

// 1. HTTP Security Headers (Helmet)
// Aide à prévenir les attaques courantes (XSS, Clickjacking, etc.)
app.use(helmet()); 

// 2. CORS (Cross-Origin Resource Sharing)
// Configuration pour permettre au frontend (Next.js) d'accéder à l'API.
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Permettre les requêtes sans origine (comme les applications mobiles ou curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// 3. Middlewares standard
app.use(express.json()); // Permet de parser le corps des requêtes en JSON
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get('/', (req: Request, res: Response) => {
    res.status(200).send({ message: 'Welcome to Vulnex API! Ready for scanning.' });
});

// Route principale pour tous les endpoints du moteur de scan
app.use('/api/v1', apiRoutes); 

// --- Gestion des Erreurs ---
// app.use(notFoundHandler); // 404 handler (à créer)
// app.use(errorHandler);   // Gestionnaire d'erreurs général (à créer)

export default app;
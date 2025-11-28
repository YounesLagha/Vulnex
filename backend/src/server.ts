import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 4000;

/**
 * Démarrage du serveur Express
 */
app.listen(PORT, () => {
    console.log(` Vulnex API Server running on port ${PORT}`);
    console.log(`   Access via: http://localhost:${PORT}`);
});
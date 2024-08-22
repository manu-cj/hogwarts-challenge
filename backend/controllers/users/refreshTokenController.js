import User from './../../models/Users.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

export async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token manquant.' });
    }

    try {
        // Vérifie et décode le refresh token
        jwt.verify(refreshToken, REFRESH_JWT_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(403).json({ message: 'Refresh token expiré.' });
                }
                return res.status(401).json({ message: 'Refresh token invalide.' });
            }

            // Recherche l'utilisateur par ID
            const user = await User.findById(decoded.id);
            if (!user || user.refreshToken !== refreshToken) {
                return res.status(401).json({ message: 'Refresh token non trouvé ou invalide.' });
            }

            // Génération d'un nouvel access token
            const newAccessToken = jwt.sign(
                { id: user.id },
                JWT_SECRET,
                { algorithm: 'HS256', expiresIn: '1h' }
            );

            return res.status(200).json({
                accessToken: newAccessToken
            });
        });
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        return res.status(500).json({ message: 'Erreur lors du rafraîchissement du token.' });
    }
}

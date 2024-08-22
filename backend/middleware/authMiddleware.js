import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAccessToken(req, res, next) {
    // Accès au header Authorization
    const authHeader = req.headers['authorization'];

    // Vérifie si le header Authorization est présent
    if (!authHeader) {
        return res.status(401).json({ message: 'Token manquant.' });
    }

    // Extrait le token du header Authorization
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token invalide.' });
    }

    // Vérifie et décode le token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Token expiré, fais une requète pour refresh le token.' });
            }
            return res.status(401).json({ message: 'Token est invalide.' });
        }

        // Ajoute les informations décodées du token à la requête
        req.user = decoded;
        next();
    });
}

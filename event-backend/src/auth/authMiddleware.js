const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey";

exports.requireAuth = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    // Bearer <token>
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ error: "Malformed Authorization header" });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // On attache l'utilisateur à la requête pour la route suivante
        req.user = decoded;

        // Et on laisse la route /api/me répondre
        return next();

    } catch (err) {
        return res.status(401).json({ error: "Token invalid" });
    }
};

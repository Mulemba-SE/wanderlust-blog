import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided. Please log in." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }
}
export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.admin) {
            res.status(401).json({ message: "Authentication required." });
            return;
        }
        if (!allowedRoles.includes(req.admin.role)) {
            res.status(403).json({ message: "You don't have permission to perform this action." });
            return;
        }
        next();
    };
}

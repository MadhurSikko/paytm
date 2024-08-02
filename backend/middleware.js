const jwt = require("jsonwebtoken");
const JWT_Secret = require("./config");

function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    
    const token = header.split(" ")[1];
    jwt.verify(token, JWT_Secret.JWT_Secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid token",
            })
        } else {
            req.userId = decoded.userId;
            next();
        }

    })
}

module.exports = authMiddleware;
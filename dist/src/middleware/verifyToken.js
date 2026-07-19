"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jose_cjs_1 = require("jose-cjs");
const jwks_js_1 = require("../utils/jwks.js");
const verifyToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization?.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            });
            return;
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token Missing",
            });
            return;
        }
        const { payload } = await (0, jose_cjs_1.jwtVerify)(token, jwks_js_1.JWKS);
        req.user = payload;
        next();
    }
    catch (error) {
        console.error("JWT Verify Error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or Expired Token",
        });
    }
};
exports.verifyToken = verifyToken;

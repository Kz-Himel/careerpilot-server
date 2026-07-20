import { jwtVerify } from "jose-cjs";
import { JWKS } from "../utils/jwks.js";
export const verifyToken = async (req, res, next) => {
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
        const { payload } = await jwtVerify(token, JWKS);
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

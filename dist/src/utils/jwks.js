"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWKS = void 0;
const jose_cjs_1 = require("jose-cjs");
exports.JWKS = (0, jose_cjs_1.createRemoteJWKSet)(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));

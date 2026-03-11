import { createRemoteJWKSet, jwtVerify } from 'jose';

let jwks

function getJWKS() {
    if (!jwks) {
        const KEYCLOAK_BASE = process.env.KEYCLOAK_BASE;
        const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM;
        jwks = createRemoteJWKSet(
            new URL(`${KEYCLOAK_BASE}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`),
        )
    }
    return jwks
}

export async function verifyToken(token) {
    const KEYCLOAK_BASE = process.env.KEYCLOAK_BASE;
    const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM;
    const KEYCLOAK_CLIENT = process.env.KEYCLOAK_CLIENT_ID
    const { payload } = await jwtVerify(token, getJWKS(), {
        issuer: `${KEYCLOAK_BASE}/realms/${KEYCLOAK_REALM}`,
        audience: KEYCLOAK_CLIENT,
    })

    return payload
}
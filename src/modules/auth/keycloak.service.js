import axios from "axios";
import { AppError } from "#/middleware/error.js"



export async function getAdminToken() {
    const response = await axios.post(
        `${process.env.KEYCLOAK_BASE}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        }),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
    )
    if (!response.data.access_token) {
        throw new AppError('Failed to get Keycloak admin token', 500);
    }
    return response.data.access_token
}

export async function createKeycloakUser(adminToken, data) {
    const response = await axios.post(
        `${process.env.KEYCLOAK_BASE}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
        {
            username: data.email,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            enabled: true,
            emailVerified: false,
            requiredActions: [],
            credentials: [{
                type: "password",
                value: data.password,
                temporary: false,
            }]
        },
        {
            headers: {
                Authorization: `Bearer ${adminToken}`,
                'Content-Type': 'application/json',
            },
            validateStatus: () => true,
        },

    )

    if (response.status !== 201) {
        const errorMessage = response.data?.errorMessage || response.data?.error || 'Keycloak user creation failed';
        throw new AppError(errorMessage, response.status || 400);
    }

    const location = response.headers.location;
    const userId = location?.split('/').pop();
    if (!userId) {
        throw new AppError('Failed to retrieve Keycloak user ID', 500);
    }

    return userId
}


export async function getKeyCloakToken(email, password) {
    try {
        const response = await axios.post(
            `${process.env.KEYCLOAK_BASE}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
            new URLSearchParams({
                grant_type: 'password',
                client_id: process.env.KEYCLOAK_CLIENT_ID,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
                username: email,
                password: password
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                validateStatus: () => true
            }
        );

        if (response.status !== 200) {
            const msg = response.data?.error_description || 'Login failed';
            throw new AppError(msg, 401);
        }

        return response.data;
    } catch (err) {
        if (err.isAxiosError) {
            throw new AppError('Unable to connect to Keycloak', 503);
        }
        throw err;
    }
}

export async function deleteKeycloakUser(adminToken, userId) {
    await axios.delete(`${process.env.KEYCLOAK_BASE}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${adminToken}`,
        },
    });
}



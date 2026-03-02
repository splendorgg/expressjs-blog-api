import axios from "axios";



export async function getAdminToken() {
    const response = await axios.post(
        `${process.env.KEYCLOAK_BASE}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
            grant_type: 'client-credentials',
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
            enabled: false,
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
        throw new AppError('Keycloak user creation failed', 400);
    }

    const location = response.headers.location;
    const userId = location?.split('/').pop();
    if (!userId) {
        throw new AppError('Failed to retrieve Keycloak user ID', 500);
    }

    return userId
}


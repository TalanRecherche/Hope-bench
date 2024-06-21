declare global {
	interface Window {
		hopeBenchConfig: WindowConfig
	}
}

interface WindowConfig {
	KEYCLOAK_SERVER_URL: string
	KEYCLOAK_REALM: string
	KEYCLOAK_CLIENT_ID: string
	BACKEND_BASE_URL: string
}

const getConfig = (key: keyof WindowConfig): string => {
	let v = window?.hopeBenchConfig?.[key]
	if (v == undefined) {
		throw new Error(`Missing configuration '${key}'`)
	}
	return v
}

export const config = {
	keycloakServerUrl: getConfig("KEYCLOAK_SERVER_URL"),
	keycloakRealm: getConfig('KEYCLOAK_REALM'),
	keycloakClientId: getConfig('KEYCLOAK_CLIENT_ID'),
	backendBaseUrl: getConfig('BACKEND_BASE_URL'),
}

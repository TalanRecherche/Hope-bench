import Keycloak from "keycloak-js";
import { createContext, PropsWithChildren, useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import Loader from "../components/Loader";
import { config } from "../config";

export type AuthContextI = {
	token: string,
	user: UserInfo,
	logout: () => void
}

export interface UserInfo {
	id: string
	email?: string
	firstname?: string
	lastname?: string
	roles: Roles[]
}

export type Roles = 'template_manager' | 'manager'

const keycloak = new Keycloak({
	url: config.keycloakServerUrl,
	realm: config.keycloakRealm,
	clientId: config.keycloakClientId
});

const refreshTokenInterval = (setToken: (v: string|undefined) => void): ReturnType<typeof setInterval> => 
	setInterval(() => {
		keycloak
		.updateToken(70)
		.then(refreshed => {
			if (refreshed) {
				setToken(keycloak.token)
				console.debug("Token refreshed", keycloak.token);
			}
		})
		.catch(() => {
			console.error("Failed to refresh token");
		});
	}, 70000)


const parseUser = (data: {[k: string]: string}): UserInfo => ({
	id: data['sub'],
	email: data['email'],
	firstname: data['given_name'],
	lastname: data['family_name'],
	roles: keycloak.tokenParsed?.resource_access?.[config.keycloakClientId]?.roles as Roles[] || []
})

export const AuthContext = createContext<AuthContextI>({
	token: '',
	user: {id: '', roles: []},
	logout: () => {
	}
});

const logout = () => keycloak.logout()

export const AuthProvider = ({children}: PropsWithChildren) => {

	const didInit = useRef(false);
	const [user, setUser] = useState<UserInfo>();
	const [token, setToken] = useState<string|undefined>();

	useEffect(() => {
		if (didInit.current) {
			return;
		}
		didInit.current = true
		let interval: ReturnType<typeof setInterval>;
		keycloak.init({
			onLoad: "login-required",
			checkLoginIframe: false
		})
		        .then(() => keycloak.loadUserInfo())
		        .then(parseUser)
		        .then(setUser)
		        .then(() => {
			        setToken(keycloak.token as string)
			        // Set interval to refresh token
					 {/* @ts-ignore */}
			        interval = refreshTokenInterval(setToken);
		        })
		return () => {
			clearInterval(interval)
		}
	}, [])

	if (token && user) {
		// ensure user is defined and token is present
		return <AuthContext.Provider value={{token, user, logout}}>{children}</AuthContext.Provider>
	} else {
		return <Container className="vh-100 d-flex">
			<Loader/>
		</Container>
	}
}

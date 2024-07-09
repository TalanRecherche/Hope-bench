# ./auth.py

from dependency_injector.wiring import Provide
from fastapi import Security, HTTPException, status, Request, Depends
from fastapi.security import OAuth2AuthorizationCodeBearer
from keycloak import KeycloakOpenID
from pydantic import Json

from ..config import Configuration
from ..models.User import User, Roles
from ..services.UserService import UserService
from ..containers import Container

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=Configuration.auth.authorization_url,
    tokenUrl=Configuration.auth.token_url,
)

# This actually does the auth checks
keycloak_openid = KeycloakOpenID(
    server_url=Configuration.auth.server_url,
    client_id='unused in current code, but required by the lib',
    realm_name=Configuration.auth.realm,
    verify=True
)


async def get_idp_public_key():
    return (
        "-----BEGIN PUBLIC KEY-----\n"
        f"{keycloak_openid.public_key()}"
        "\n-----END PUBLIC KEY-----"
    )


async def get_auth(request: Request, token: str = Security(oauth2_scheme)) -> User:
    try:
        kc_user: Json = keycloak_openid.decode_token(
            token,
            key=await get_idp_public_key(),
            options={
                "verify_signature": True,
                "verify_aud": False,
                "exp": True
            }
        )
        str_roles = kc_user.get('resource_access', {}).get(Configuration.auth.client_front_id, {}).get('roles', [])
        user = User(
            kc_user.get('sub'),
            [Roles(role) for role in str_roles],
            " ", " ", None, None
        )
        request.state.user = user
        return user
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),  # "Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def has_role(role: str | Roles, request: Request) -> bool:
    user: User = request.state.user
    return role in user.roles


def check_role(role: str | Roles, request: Request) -> None:
    if not has_role(role, request):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

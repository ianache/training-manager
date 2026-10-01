import * as client from 'openid-client';
import type { Env } from '../config/env.js';

/** Claims mínimos que el BFF usa del id_token / access_token de Keycloak. */
export interface IdentityClaims {
  sub: string;
  preferred_username: string;
  name?: string;
  email?: string;
  roles: string[];
}

export interface TokenSet {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  /** epoch ms */
  expiresAt: number;
  identity: IdentityClaims;
}

export interface LoginRequest {
  authorizationUrl: string;
  codeVerifier: string;
  state: string;
}

/**
 * Puerto hacia el proveedor de identidad. La implementación real usa openid-client;
 * los tests inyectan un doble. Mantener aquí todo lo específico de Keycloak.
 */
export interface OidcPort {
  startLogin(): Promise<LoginRequest>;
  completeLogin(callbackUrl: URL, codeVerifier: string, expectedState: string): Promise<TokenSet>;
  refresh(refreshToken: string): Promise<TokenSet>;
  /** Token de la cuenta de servicio del BFF (client_credentials) para llamar microservicios (ADR-005 §2). */
  serviceToken(): Promise<{ accessToken: string; expiresAt: number }>;
  logoutUrl(idToken: string | undefined, postLogoutRedirectUri: string): string;
}

export async function createKeycloakOidc(env: Env): Promise<OidcPort> {
  const insecure = new URL(env.OIDC_ISSUER).protocol === 'http:';
  if (insecure && env.NODE_ENV === 'production') {
    throw new Error('OIDC_ISSUER debe usar HTTPS en producción');
  }
  const internalFetch = backchannelFetch(env.OIDC_ISSUER, env.OIDC_INTERNAL_URL);
  const config = await client.discovery(
    new URL(env.OIDC_ISSUER),
    env.OIDC_CLIENT_ID,
    env.OIDC_CLIENT_SECRET,
    undefined,
    {
      timeout: 5,
      ...(insecure || internalFetch ? { execute: [client.allowInsecureRequests] } : {}),
      ...(internalFetch ? { [client.customFetch]: internalFetch } : {}),
    },
  );
  if (internalFetch) config[client.customFetch] = internalFetch;

  const toTokenSet = (t: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers): TokenSet => {
    const access = decodeJwtPayload(t.access_token);
    const id: Record<string, unknown> = t.claims() ?? {};
    return {
      accessToken: t.access_token,
      refreshToken: t.refresh_token,
      idToken: t.id_token,
      expiresAt: Date.now() + (t.expires_in ?? 300) * 1000,
      identity: {
        sub: String(id['sub'] ?? access['sub'] ?? ''),
        preferred_username: String(id['preferred_username'] ?? access['preferred_username'] ?? ''),
        name: (id['name'] ?? access['name']) as string | undefined,
        email: (id['email'] ?? access['email']) as string | undefined,
        roles: extractRealmRoles(access),
      },
    };
  };

  return {
    async startLogin() {
      const codeVerifier = client.randomPKCECodeVerifier();
      const state = client.randomState();
      const url = client.buildAuthorizationUrl(config, {
        redirect_uri: env.OIDC_REDIRECT_URI,
        scope: 'openid profile email',
        code_challenge: await client.calculatePKCECodeChallenge(codeVerifier),
        code_challenge_method: 'S256',
        state,
      });
      return { authorizationUrl: url.href, codeVerifier, state };
    },
    async completeLogin(callbackUrl, codeVerifier, expectedState) {
      const t = await client.authorizationCodeGrant(config, callbackUrl, {
        pkceCodeVerifier: codeVerifier,
        expectedState,
      });
      return toTokenSet(t);
    },
    async refresh(refreshToken) {
      return toTokenSet(await client.refreshTokenGrant(config, refreshToken));
    },
    async serviceToken() {
      const t = await client.clientCredentialsGrant(config);
      return { accessToken: t.access_token, expiresAt: Date.now() + (t.expires_in ?? 300) * 1000 };
    },
    logoutUrl(idToken, postLogoutRedirectUri) {
      return client.buildEndSessionUrl(config, {
        post_logout_redirect_uri: postLogoutRedirectUri,
        ...(idToken ? { id_token_hint: idToken } : {}),
      }).href;
    },
  };
}

/**
 * Reescribe el origen público del issuer al origen interno para las llamadas del servidor.
 * Devuelve undefined si no hay origen interno configurado o si coincide con el público.
 */
function backchannelFetch(issuer: string, internalUrl: string): client.CustomFetch | undefined {
  if (!internalUrl) return undefined;
  const publicOrigin = new URL(issuer).origin;
  const internalOrigin = new URL(internalUrl).origin;
  if (publicOrigin === internalOrigin) return undefined;
  return (url, options) => {
    const target = url.startsWith(publicOrigin) ? internalOrigin + url.slice(publicOrigin.length) : url;
    return fetch(target, options as RequestInit);
  };
}

/**
 * Lee el payload del access token SIN verificar firma: el token llegó al BFF por el canal
 * TLS del token endpoint, no desde el navegador. No usar con tokens de origen no confiable.
 */
function decodeJwtPayload(jwt: string): Record<string, unknown> {
  const part = jwt.split('.')[1];
  if (!part) return {};
  try {
    return JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function extractRealmRoles(access: Record<string, unknown>): string[] {
  const realm = access['realm_access'] as { roles?: unknown } | undefined;
  return Array.isArray(realm?.roles) ? realm.roles.filter((r): r is string => typeof r === 'string') : [];
}

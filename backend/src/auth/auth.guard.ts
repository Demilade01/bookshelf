import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

/**
 * Authentication guard that protects GraphQL resolvers by verifying JWT access tokens.
 *
 * This guard implements Auth0's recommended security pattern for API authentication:
 * 1. Extract the Bearer token from the Authorization header
 * 2. Decode the token to get the key ID (kid) from the header
 * 3. Fetch the corresponding public key from Auth0's JWKS endpoint
 * 4. Verify the token's signature, audience, and issuer
 *
 * We use JWKS (JSON Web Key Set) instead of hardcoding keys because Auth0 rotates
 * signing keys periodically. The JWKS client caches keys for 24 hours to reduce
 * network requests while still allowing key rotation.
 *
 * Note: We verify ACCESS tokens (not ID tokens) because this is an API endpoint.
 * Access tokens are designed for API authorization, while ID tokens are for user
 * identity information.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private client: jwksClient.JwksClient;
  private audience: string;
  private issuer: string;

  constructor() {
    const domain = process.env.AUTH0_DOMAIN;
    const audience = process.env.AUTH0_AUDIENCE;

    // Fail fast if required configuration is missing
    // This prevents the application from starting with invalid auth configuration
    if (!domain || !audience) {
      throw new Error(
        'AUTH0_DOMAIN and AUTH0_AUDIENCE must be set in environment variables',
      );
    }

    // Construct issuer URL (Auth0's standard format)
    this.issuer = `https://${domain}/`;
    this.audience = audience;

    // Initialize JWKS client to fetch Auth0's public keys
    // Caching is enabled to improve performance - keys are fetched once and
    // reused for 24 hours. This balances security (key rotation) with performance.
    this.client = jwksClient({
      jwksUri: `${this.issuer}.well-known/jwks.json`,
      cache: true,
      cacheMaxAge: 86400000, // 24 hours in milliseconds
    });
  }

  /**
   * Main guard method that validates the JWT token before allowing access.
   *
   * This method is called by NestJS for every request to protected routes/resolvers.
   * It returns true if the token is valid, or throws UnauthorizedException if not.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Convert NestJS execution context to GraphQL context
    // This is necessary because GraphQL resolvers have a different context structure
    // than REST controllers
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // Extract the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No authorization token provided');
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    try {
      // Decode the token without verification to get the header information
      // We need the 'kid' (key ID) from the header to know which public key to fetch
      const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload & {
        header: { kid: string };
      };

      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new UnauthorizedException('Invalid token format');
      }

      // Fetch the public key from Auth0's JWKS endpoint using the key ID
      // This key is used to verify the token's signature
      const key = await this.getSigningKey(decoded.header.kid);

      // Verify the token's signature, expiration, audience, and issuer
      // This ensures:
      // - The token was signed by Auth0 (signature verification)
      // - The token hasn't expired
      // - The token was issued for our API (audience check)
      // - The token was issued by our Auth0 tenant (issuer check)
      jwt.verify(token, key, {
        audience: this.audience, // Must match the API identifier in Auth0
        issuer: this.issuer,     // Must match Auth0 domain
        algorithms: ['RS256'],   // RSA with SHA-256 (Auth0's standard)
      });

      return true;
    } catch (error) {
      // Log the error for debugging, but don't expose sensitive details to the client
      console.error('Token verification error:', error);
      throw new UnauthorizedException(
        `Invalid or expired token: ${error.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Fetches the public key from Auth0's JWKS endpoint.
   *
   * The key ID (kid) in the JWT header tells us which key was used to sign the token.
   * We use this to fetch the corresponding public key from Auth0's JWKS endpoint.
   * The JWKS client handles caching automatically.
   */
  private getSigningKey(kid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.getSigningKey(kid, (err, key) => {
        if (err) {
          reject(err);
          return;
        }
        if (!key) {
          reject(new Error('Signing key not found'));
          return;
        }
        // Extract the public key from the JWK (JSON Web Key)
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      });
    });
  }
}

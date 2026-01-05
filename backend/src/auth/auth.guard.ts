import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

@Injectable()
export class AuthGuard implements CanActivate {
  private client: jwksClient.JwksClient;
  private audience: string;
  private issuer: string;

  constructor() {
    const domain = process.env.AUTH0_DOMAIN;
    const audience = process.env.AUTH0_AUDIENCE;

    if (!domain || !audience) {
      throw new Error(
        'AUTH0_DOMAIN and AUTH0_AUDIENCE must be set in environment variables',
      );
    }

    this.issuer = `https://${domain}/`;
    this.audience = audience;

    // Initialize JWKS client to fetch Auth0's public keys
    this.client = jwksClient({
      jwksUri: `${this.issuer}.well-known/jwks.json`,
      cache: true,
      cacheMaxAge: 86400000, // 24 hours
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No authorization token provided');
    }

    const token = authHeader.substring(7);

    try {
      // Decode the token to get the kid (key ID)
      const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload & {
        header: { kid: string };
      };

      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new UnauthorizedException('Invalid token format');
      }

      // Get the signing key from Auth0's JWKS endpoint
      const key = await this.getSigningKey(decoded.header.kid);

      // Verify the token
      const payload = jwt.verify(token, key, {
        audience: this.audience,
        issuer: this.issuer,
        algorithms: ['RS256'],
      });

      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new UnauthorizedException(
        `Invalid or expired token: ${error.message || 'Unknown error'}`,
      );
    }
  }

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
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      });
    });
  }
}

import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AuthGuard implements CanActivate {
    private client;
    private audience;
    private issuer;
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getSigningKey;
}

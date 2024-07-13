import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { IS_PUBLIC_ROUTE_KEY } from "src/decorators/public-route.decorator"
import { Request } from "express"
import { JwtService } from "@nestjs/jwt"
import { jwtConstants } from "./constants"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (isPublic) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException()
        }
        
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            )
            request["user"] = payload
        } catch {
            throw new UnauthorizedException()
        }
        
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? []
        return type === "Bearer" ? token : undefined
    }
}

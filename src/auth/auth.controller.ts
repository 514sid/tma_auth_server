import { Controller, Post, Get, Body, Request } from "@nestjs/common"
import { PublicRoute } from "src/decorators/public-route.decorator"
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @PublicRoute()
    @Post("login")
    async login(@Body() body: { initData: string }) {
        return await this.authService.login(body.initData)
    }

    @Get("me")
    async getCurrentUser(@Request() req: Request & { id: number }) {
        return await this.authService.getUserById(req.id)
    }
}

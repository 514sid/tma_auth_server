import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { parse, validate } from "@telegram-apps/init-data-node"
import { User } from "src/users/entities/user.entity"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) {}

    async login(initData: string) {
        const botToken = "5000342832:AAGohbqbb7y_vuAbm1D9qu7SO9XVi1mY2rY"
    
        try {
            validate(initData, botToken, {
                expiresIn: 300,
            })
    
            const parsedData = parse(initData)

            const user = await this.findOrCreateUser(parsedData.user.id, parsedData.user.username)

            const payload = { id: user.id }
    
            return {
                user,
                token: await this.jwtService.signAsync(payload)
            }
        } catch (e) {
            throw new UnauthorizedException()
        }
    }

    async findOrCreateUser(telegramId: number, username: string) {
        let user = await User.findByTelegramId(telegramId)

        if (!user) {
            user = new User()
            user.telegramId = telegramId.toString()
            user.username = username
            await user.save()
        }

        return user
    }

    async getUserById(id: number) {
        const user = await User.findOne({ where: { id } })

        if (!user) {
            throw new NotFoundException()
        }

        return user
    }
}
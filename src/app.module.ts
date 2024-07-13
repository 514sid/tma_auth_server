import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { User } from "./users/entities/user.entity"

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "db/main.sqlite3",
            synchronize: true,
            entities: [User],
        }),
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

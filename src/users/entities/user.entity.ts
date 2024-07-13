import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
        id: number

    @Column({ type: "bigint", unique: true })
        telegramId: string

    @Column()
        username: string

    static findByTelegramId(telegramId: number) {
        return this.createQueryBuilder("user")
            .where("user.telegramId = :telegramId", { telegramId })
            .getOne()
    }
}
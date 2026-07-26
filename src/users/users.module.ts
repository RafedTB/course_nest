import {Module} from "@nestjs/common";
import { UsersController } from "./users.controller";
import { usersService } from "./users.service";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    controllers:[UsersController],
    providers: [usersService],
    imports: [TypeOrmModule.forFeature([User])]
})

export class UsersModule {}
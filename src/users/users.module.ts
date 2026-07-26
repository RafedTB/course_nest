import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { usersService } from "./users.service";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {JWTPayloadType} from "../utils/types";

@Module({
    controllers: [UsersController],
    providers: [usersService],
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory:(config:ConfigService) =>{
                return {
                    global:true,
                    secret:config.get('JWT_SECRET'),
                    signOptions:{
                        expiresIn:config.get('JWT_EXPIRES_IN')
                    }
                }
            }
        })
    ]
})
export class UsersModule {}
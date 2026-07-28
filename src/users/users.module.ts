import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { usersService } from "./users.service";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthProvider } from "./auth.provider";

@Module({
    controllers: [UsersController],
    providers: [usersService, AuthProvider],
    exports:[usersService],
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
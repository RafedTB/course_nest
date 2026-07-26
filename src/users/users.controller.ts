import {Body, Controller, Get, Post} from "@nestjs/common";
import { usersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: usersService,

    ) {}
    
    @Post('auth/register')
    public register(@Body() registerDto: RegisterDto) {
        return this.usersService.register(registerDto);
        
    }

        
}
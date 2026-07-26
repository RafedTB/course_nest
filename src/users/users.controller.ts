import {Body, Controller, Get, HttpCode, Post,HttpStatus} from "@nestjs/common";
import { usersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: usersService,

    ) {}
    
    @Post('auth/register')
    public register(@Body() registerDto: RegisterDto) {
        return this.usersService.register(registerDto);

    }

    @Post('auth/login')
    @HttpCode(HttpStatus.OK)
    public login(@Body() loginDto: LoginDto) {
        return this.usersService.login(loginDto);
    }



        
}
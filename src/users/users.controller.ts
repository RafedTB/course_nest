import {Body, Controller, Get, HttpCode, Post,HttpStatus,Req, UseGuards} from "@nestjs/common";
import { usersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { currentUser } from "./decorators/current-user.decorator";
import type {JWTPayloadType} from "../utils/types";


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

    //GET /api/users/current-user
    @Get('current-user')
    @UseGuards(AuthGuard)
    public getCurrentUser(@currentUser() payload: JWTPayloadType ) {
        return this.usersService.getCurrentUser(payload.id);
    }



        
}
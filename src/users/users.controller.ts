import {Body, Controller, Get, HttpCode, Post,HttpStatus, UseGuards,Put,Delete, Param, ParseIntPipe} from "@nestjs/common";
import { usersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import {AuthRolesGuard} from "./guards/auth-roles.guard";
import { currentUser } from "./decorators/current-user.decorator";
import type {JWTPayloadType} from "../utils/types";
import {Roles} from "./decorators/user-role.decorator";
import { UserType } from "src/utils/enum";
import { UpdateUserDto } from "./dto/update-user.dto";


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

    //Get /api/users
    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    
    public getAllUsers() {
        return this.usersService.getAllUsers();
    }

    //PUT /api/users
    @Put()
    @Roles(UserType.ADMIN,UserType.USER)
    @UseGuards(AuthRolesGuard)
    public updateUser(@currentUser() payload: JWTPayloadType, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(payload.id, updateUserDto);
    }

    //DELETE /api/users/:id
    @Delete(':id')
    @Roles(UserType.ADMIN,UserType.USER)
    @UseGuards(AuthRolesGuard)
    public deleteUser(@Param('id', ParseIntPipe) id: number, @currentUser() payload: JWTPayloadType) {
        return this.usersService.deleteUser(id, payload);
    }

        
}
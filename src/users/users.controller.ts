import {Body, Controller, Get, HttpCode, Post,HttpStatus, UseGuards,Put,Delete, Param, ParseIntPipe,UseInterceptors,UploadedFile, BadRequestException, Res} from "@nestjs/common";
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
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import type {Express,Response} from "express";


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


    //POST /api/users/upload-profile-image
    @Post('upload-profile-image')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('user-image', {
        storage: diskStorage({
            destination: './uploads/profile-images',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const originalName = file.originalname.replace(/\s+/g, '-');
                const filename = `${uniqueSuffix}-${originalName}`;
                cb(null, filename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            }else{
                cb(new BadRequestException('Only image files are allowed!'), false);
            }
        },
        limits: {
            fileSize: 2 * 1024 * 1024, // 2MB limit
        },
    }))
    public uploadProfileImage(@UploadedFile() file: Express.Multer.File, @currentUser() payload: JWTPayloadType) {
        if (!file) throw new BadRequestException('No Image uploaded or invalid file type.');
        return this.usersService.setProfileImage(payload.id, file.filename);
    }

    //DELETE /api/users/images/remove-profile-image
    @Delete('/images/remove-profile-image')
    @UseGuards(AuthGuard)
    public RemoveProfileImage(@currentUser() payload: JWTPayloadType) {
        return this.usersService.removeProfileImage(payload.id);
    }

    @Get('/images/:image')
    @UseGuards(AuthGuard)
    public showProfileImage(@Param('image') image: string, @Res() res: Response) {
        return res.sendFile(image, { root: './uploads/profile-images' });
    }

}
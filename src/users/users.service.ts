import { BadRequestException, Injectable, NotFoundException,ForbiddenException} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JWTPayloadType,accessTokenType} from "src/utils/types";
import { UpdateUserDto } from "./dto/update-user.dto";



@Injectable()
export class usersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}
        
    /**
     * creates a new user in the database after validating email the input and hashing the password.
     * @param registerDto data for creating a new user, including email, password, and optional username.
     * @returns JWT(ACCESS_TOKEN) token for the newly created user.
     */
    public async register(registerDto: RegisterDto): Promise<accessTokenType> {
        const {email, password, username} = registerDto;
        const UserFromDb=await this.userRepository.findOne({where:{email}});
        if (UserFromDb) throw new BadRequestException('User with this email already exists');
        const hashedPassword = await this.HashPassword(password);
        let newUser = this.userRepository.create({
            email,
            password: hashedPassword,
            username
        });
        newUser = await this.userRepository.save(newUser);
        const accessToken = await this.GenerateJWT({id:newUser.id, userType:newUser.userType});

        return {accessToken};
    }

    /**
     * login a user by eamil and password
     * @param loginDto data for logging in a user
     * @returns JWT(ACCESS_TOKEN) token for the logged in user.
     */
    public async login(loginDto: LoginDto) : Promise<accessTokenType> {
        const {email, password} = loginDto;
        const user = await this.userRepository.findOne({where:{email}});
        if (!user) throw new BadRequestException('Invalid email or password');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Invalid email or password');
        const accessToken = await this.GenerateJWT({id:user.id, userType:user.userType});
        
        return {accessToken};
    }

    /**
     * get currecnt user (logged in user) by id
     * @param id id of the user to be retrieved
     * @returns the user from database
     */
    public async getCurrentUser(id: number): Promise<User> {
        const user = await this.userRepository.findOne({where:{id}});
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    /**
     * Get All users form database
     * @returns collection of users from database
     */
    public getAllUsers():Promise<User[]> {
        return this.userRepository.find();
    }


    /**
     * Update user by id and updateUserDto
     * @param id id of the logged in user to be updated
     * @param updateUserDto data for updating the user, including optional password and username.
     * @returns the updated user
     */
    public async updateUser(id: number, updateUserDto: UpdateUserDto) {
        const { password, username } = updateUserDto;
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        user.username = username ?? user.username;
        if (password) {
            user.password = await this.HashPassword(password);
        }
        return this.userRepository.save(user);
    }

    /**
     * delete user by id and payload
     * @param userid id of the user to be deleted
     * @param payload JWT payload of the logged in user
     * @returns a success message if the user is deleted successfully, otherwise throws a ForbiddenException if the logged in user is not authorized to delete the user.
     */
    public async deleteUser(userid: number,payload: JWTPayloadType) {
        const user = await this.getCurrentUser(userid);
        if(user.id === payload?.id ||payload.userType === 'ADMIN'){
            await this.userRepository.remove(user);
            return {message: 'User deleted successfully'};
        }
        throw new ForbiddenException('You are not authorized to delete this user');
    }
        

    /**
     * Generates a JWT token for the given payload.
     * @param payload JWT PAYLOAD
     * @returns TOEKN
     */
    private GenerateJWT(payload: JWTPayloadType): Promise<string> {
        return this.jwtService.signAsync(payload);
    }


    /**
     * Hashes a password using bcrypt.
     * @param password plain text password to be hashed
     * @returns hashed password
     */
    private async HashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
}
import { BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JWTPayloadType,accessTokenType} from "src/utils/types";



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
        const salt =await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
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
     * Generates a JWT token for the given payload.
     * @param payload JWT PAYLOAD
     * @returns TOEKN
     */
    private GenerateJWT(payload: JWTPayloadType): Promise<string> {
        return this.jwtService.signAsync(payload);
    }
}
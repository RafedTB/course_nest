import { BadRequestException, Injectable} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dto/login.dto";


@Injectable()
export class usersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}
        

    /**
     * creates a new user in the database after validating email the input and hashing the password.
     * @param registerDto data for creating a new user, including email, password, and optional username.
     * @returns JWT(ACCESS_TOKEN) token for the newly created user.
     */
    public async register(registerDto: RegisterDto) {
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
        // TODO: Generate JWT token
        return newUser;
    }


    /**
     * login a user by eamil and password
     * @param loginDto data for logging in a user
     * @returns JWT(ACCESS_TOKEN) token for the logged in user.
     */
    public async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        const user = await this.userRepository.findOne({where:{email}});
        if (!user) throw new BadRequestException('Invalid email or password');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Invalid email or password');
        // TODO: Generate JWT token
        return user;
    }
}
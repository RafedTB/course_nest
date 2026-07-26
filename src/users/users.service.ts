import { BadRequestException, Injectable} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcryptjs';


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
}
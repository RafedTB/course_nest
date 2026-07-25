import {Controller, Get} from "@nestjs/common";
import { usersService } from "./users.service";
import { ReviewsService } from "src/reviews/reviews.service";
@Controller()
export class UsersController {
    constructor(private readonly usersService: usersService,
                private readonly reviewsService: ReviewsService
    ) {}
    @Get("/api/users")
    public getAllUsers() {
        return this.usersService.getAllUsers();
    }
}
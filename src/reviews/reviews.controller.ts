import {Controller, Get} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { usersService } from "src/users/users.service";
@Controller()
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService,
        private readonly usersService: usersService
    ) {}
    @Get("/api/reviews")
    public getAllReviews() {
        return this.reviewsService.getAll();
    }
}
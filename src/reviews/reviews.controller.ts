import {Controller, Get,Post,Body,Param,ParseIntPipe, UseGuards} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import {currentUser} from "src/users/decorators/current-user.decorator";
import {Roles} from "../users/decorators/user-role.decorator"
import {AuthRolesGuard} from "../users/guards/auth-roles.guard"
import { CreateReviewDto } from "./dto/create-review.dto";
import { UserType } from "src/utils/enum";
@Controller("/api/reviews")
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService,
        
    ) {}
    @Post(":productId")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.USER,UserType.ADMIN)
    public createNewReview(@Param("productId", ParseIntPipe) productId: number, @Body() body: CreateReviewDto
    ,@currentUser() payload) {
        return this.reviewsService.createReview(productId,payload.id,body);

    }
}
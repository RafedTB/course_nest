import {Controller, Get,Post,Body,Param,ParseIntPipe, UseGuards, Put, Delete} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import {currentUser} from "src/users/decorators/current-user.decorator";
import {Roles} from "../users/decorators/user-role.decorator"
import {AuthRolesGuard} from "../users/guards/auth-roles.guard"
import { CreateReviewDto } from "./dto/create-review.dto";
import { UserType } from "src/utils/enum";
import { UpdateReviewDto } from "./dto/update-review.dto";
import type { JWTPayloadType } from "src/utils/types";
@Controller("/api/reviews")
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService,
        
    ) {}

    //POST /api/reviews/:productId
    @Post(":productId")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.USER,UserType.ADMIN)
    public createNewReview(@Param("productId", ParseIntPipe) productId: number, @Body() body: CreateReviewDto
    ,@currentUser() payload:JWTPayloadType) {
        return this.reviewsService.createReview(productId,payload.id,body);

    }

    //GET /api/reviews
    @Get()
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public getAllReviews() {
        return this.reviewsService.getAllReviews();
    }


    //PUT /api/reviews/:id
    @Put(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.USER,UserType.ADMIN)
    public updateReview(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateReviewDto
    ,@currentUser() payload:JWTPayloadType) {
        return this.reviewsService.updateReview(id,payload.id,body);

    }


    //DELETE /api/reviews/:id
    @Delete(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.USER,UserType.ADMIN)
    public deleteReview(@Param("id", ParseIntPipe) id: number,@currentUser() payload:JWTPayloadType) {
        return this.reviewsService.deleteReview(id,payload.id);
    }

}
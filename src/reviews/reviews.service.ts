import {Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { ProductsService } from "src/products/products.service";
import { usersService } from "src/users/users.service";
import { CreateReviewDto } from "./dto/create-review.dto";


@Injectable()
export class ReviewsService { 
    constructor(
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
        private readonly productService: ProductsService,
        private readonly userService: usersService

      ) {}


      /**
       * create a new review for a product by a user
       * @param productId id of the product to be reviewed
       * @param userId id of the user creating the review
       * @param dto data for creating the review, including rating and comment
       * @returns createed review object from database
       */
      public async createReview(productId:number,userId:number,dto :CreateReviewDto){
        const product = await this.productService.getOneBy(productId);
        const user = await this.userService.getCurrentUser(userId);
        const review = this.reviewRepository.create({
            ...dto,
            user,
            product
        });
        const result= await this.reviewRepository.save(review);
        return {
            id: result.id,
            comment: result.comment,
            rating: result.rating,
            createdAt: result.createdAt,
            userId: result.user.id,
            productId: result.product.id
        }
      }

 }
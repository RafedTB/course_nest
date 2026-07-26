import {Module,forwardRef} from "@nestjs/common";
import {ReviewsController} from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { UsersModule } from "src/users/users.module";
import { Review } from "./review.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
  imports: [forwardRef(() => UsersModule),TypeOrmModule.forFeature([Review])],
})
export class ReviewsModule {}
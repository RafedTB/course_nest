import {Module,forwardRef} from "@nestjs/common";
import { UsersController } from "./users.controller";
import { usersService } from "./users.service";
import { ReviewsModule } from "src/reviews/reviews.module";

@Module({
    controllers:[UsersController],
    providers: [usersService],
    exports: [usersService],
    imports: [forwardRef(() => ReviewsModule)]
})

export class UsersModule {}
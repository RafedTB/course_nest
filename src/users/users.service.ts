import { Injectable,Inject,forwardRef } from "@nestjs/common";
import { ReviewsService } from "src/reviews/reviews.service";

@Injectable()
export class usersService {
    constructor(
        @Inject(forwardRef(() => ReviewsService))
        private readonly reviewsService: ReviewsService) {}
        
        public getAllUsers() {
        return [
            { id: 1, name: "User 1", email: "user1@example.com" },
            { id: 2, name: "User 2", email: "user2@example.com" },
            { id: 3, name: "User 3", email: "user3@example.com" },
        ];
    }
}
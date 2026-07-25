import {Injectable,Inject,forwardRef} from "@nestjs/common";
import { usersService } from "src/users/users.service";

@Injectable()
export class ReviewsService { 
    constructor(
        @Inject(forwardRef(() => usersService))
        private readonly usersService: usersService) {}
        
        public getAll() {
            return [
                {id:1, productId: 1, review: "Great product!"},
                {id:2, productId: 2, review: "Not bad."},
                {id:3, productId: 3, review: "Could be better."},
            ];
        }
 }
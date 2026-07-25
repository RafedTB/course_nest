import {Module} from "@nestjs/common";
import {ProductsController} from "./products.controller";
import { ProductsService } from "./products.service";
import { Product } from "./product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductsModule {}
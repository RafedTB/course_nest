import { Module } from '@nestjs/common';
import {ProductsModule} from './products/products.module';
import {UsersModule} from './users/users.module';
import {ReviewsModule} from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
@Module({
  imports: [
    ProductsModule,
    UsersModule,
    ReviewsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'nestlearn',
      synchronize: true,
      entities:[Product],
    }),
  ],
})
export class AppModule {}

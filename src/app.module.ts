import { ClassSerializerInterceptor, MiddlewareConsumer, Module ,NestModule,RequestMethod} from '@nestjs/common';
import {ProductsModule} from './products/products.module';
import {UsersModule} from './users/users.module';
import {ReviewsModule} from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { Review } from './reviews/review.entity';
import { User } from './users/user.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';
import { LoogerMiddleware } from './utils/middlewares/logger.middleware';
import {ThrottlerModule,ThrottlerGuard} from '@nestjs/throttler';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 4000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 7,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 15,
      }
    ]),
    ProductsModule,
    UsersModule,
    ReviewsModule,
    UploadsModule,
    MailModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DATABASE'),
        synchronize: process.env.NODE_ENV !== 'production',
        entities:[Product,User,Review],
      }),
    }),
  ],
  providers: [
    {provide:APP_INTERCEPTOR,useClass:ClassSerializerInterceptor},
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoogerMiddleware).forRoutes({path:'api/products',method:RequestMethod.GET});
  }
}

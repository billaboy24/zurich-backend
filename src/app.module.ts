import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from './middleware/jwt/jwt.middleware';
import { RolesGuard } from './roles/roles.guard';
import { RateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  providers: [RolesGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, RateLimiterMiddleware, LoggerMiddleware)
      .forRoutes('*');
  }
}

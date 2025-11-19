import { ImagesModule } from './images/images.module';
import { LikesController } from './likes/likes.controller';
import { LikesService } from './likes/likes.service';
import { ImagesService } from './images/images.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { RegisterModule } from './register/register.module';
import { OmiseModule } from './omise/omise.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    ImagesModule,
    AuthModule,
    UsersModule, OmiseModule, SubscriptionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), RegisterModule,],
  controllers: [
    LikesController, AppController],
  providers: [
    LikesService,
    ImagesService, AppService],
})
export class AppModule { }

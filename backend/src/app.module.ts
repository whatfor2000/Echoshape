import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { RegisterModule } from './register/register.module';
import { OmiseModule } from './omise/omise.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule,OmiseModule,
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }), RegisterModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

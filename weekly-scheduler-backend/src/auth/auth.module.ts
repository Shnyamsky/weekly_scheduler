import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"

import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"

import { UserModule } from "src/user/user.module"

import { getJwtConfig } from "src/config/jwt.config"
import { JwtStrategy } from "./jwt.stratejy"

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
})
export class AuthModule {}

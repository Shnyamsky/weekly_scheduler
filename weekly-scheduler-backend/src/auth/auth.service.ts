import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { verify } from "argon2"
import { Response } from "express"

import { UserService } from "src/user/user.service"

import { AuthDto } from "./dto/auth.dto"

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1
  REFRESH_TOKEN_NAME = "refreshToken"

  constructor(
    private jwt: JwtService,
    private userService: UserService
  ) {}

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email)
    if (!user) throw new NotFoundException("User not found")

    const isValid = await verify(user.password, dto.password)
    if (!isValid) throw new UnauthorizedException("Invalid password")

    return user
  }

  private issueToken(userId: string) {
    const data = { id: userId }

    const accessToken = this.jwt.sign(data, {
      expiresIn: "1h",
    })

    const refreshToken = this.jwt.sign(data, {
      expiresIn: "7d",
    })

    return { accessToken, refreshToken }
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date()
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      // TODO: get this from .env
      domain: "localhost",
      expires: expiresIn,
      // TODO: true if production
      secure: false,
      // TODO: lax if production
      sameSite: "none",
    })
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, "", {
      httpOnly: true,
      // TODO: get this from .env
      domain: "localhost",
      expires: new Date(0),
      // TODO: true if production
      secure: false,
      // TODO: lax if production
      sameSite: "none",
    })
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken)
    if (!result) throw new UnauthorizedException("Invalid refresh token")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.getById(result.id)
    const tokens = this.issueToken(user.id)

    return {
      user,
      ...tokens,
    }
  }

  async login(dto: AuthDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.validateUser(dto)
    const tokens = this.issueToken(user.id)

    return {
      user,
      ...tokens,
    }
  }

  async register(dto: AuthDto) {
    const existedUser = await this.userService.getByEmail(dto.email)
    if (existedUser) throw new BadRequestException("User already exists")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.create(dto)
    const tokens = this.issueToken(user.id)

    return {
      user,
      ...tokens,
    }
  }
}

import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from "@nestjs/common"

import { Auth } from "src/auth/decorators/auth.decorator"
import { CurrentUser } from "src/auth/decorators/user.decorator"

import {
  PomodoroTimerSessionDto,
  PomodoroTimerRoundDto,
} from "./dto/pomodoro-timer.dto"
import { PomodoroTimerService } from "./pomodoro-timer.service"

@Controller("user/pomodoro-timer")
export class PomodoroTimerController {
  constructor(private readonly pomodoroTimerService: PomodoroTimerService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put("round/:id")
  @Auth()
  async updateRound(
    @Body() dto: Partial<PomodoroTimerRoundDto>,
    @Param("id") id: string
  ) {
    return this.pomodoroTimerService.updateRound(dto, id)
  }

  @Get("today")
  @Auth()
  async getTodaySession(@CurrentUser("id") userId: string) {
    return this.pomodoroTimerService.getTodaySession(userId)
  }

  @HttpCode(200)
  @Post()
  @Auth()
  async createSession(@CurrentUser("id") userId: string) {
    return this.pomodoroTimerService.createSession(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(":id")
  @Auth()
  async updateSession(
    @Body() dto: Partial<PomodoroTimerSessionDto>,
    @Param("id") id: string,
    @CurrentUser("id") userId: string
  ) {
    return this.pomodoroTimerService.updateSession(dto, id, userId)
  }

  @HttpCode(200)
  @Delete(":id")
  @Auth()
  async deleteSession(
    @Param("id") id: string,
    @CurrentUser("id") userId: string
  ) {
    return this.pomodoroTimerService.deleteSession(id, userId)
  }
}

import { Module } from "@nestjs/common"

import { PomodoroTimerService } from "./pomodoro-timer.service"
import { PomodoroTimerController } from "./pomodoro-timer.controller"

import { PrismaService } from "src/prisma.service"

@Module({
  controllers: [PomodoroTimerController],
  providers: [PrismaService, PomodoroTimerService],
  exports: [PomodoroTimerService],
})
export class PomodoroTimerModule {}

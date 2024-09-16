import { Injectable, NotFoundException } from "@nestjs/common"

import { PrismaService } from "src/prisma.service"

import {
  PomodoroTimerSessionDto,
  PomodoroTimerRoundDto,
} from "./dto/pomodoro-timer.dto"

@Injectable()
export class PomodoroTimerService {
  constructor(private prisma: PrismaService) {}

  async getTodaySession(userId: string) {
    const today = new Date().toISOString().split("T")[0]

    return this.prisma.pomodoroSession.findFirst({
      where: {
        createdAt: { gte: new Date(today) },
        userId,
      },
      include: {
        pomodoroRounds: {
          orderBy: { id: "asc" },
        },
      },
    })
  }

  async createSession(userId: string) {
    const todaySession = await this.getTodaySession(userId)

    if (todaySession) return todaySession

    // TODO: add into user service
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { intervalsCount: true },
    })

    if (!user) throw new NotFoundException("User not found")

    return this.prisma.pomodoroSession.create({
      data: {
        pomodoroRounds: {
          createMany: {
            data: Array.from({ length: user.intervalsCount }, () => ({
              totalSeconds: 0,
            })),
          },
        },
        user: {
          connect: { id: userId },
        },
      },
      include: {
        pomodoroRounds: true,
      },
    })
  }

  async updateSession(
    dto: Partial<PomodoroTimerSessionDto>,
    pomodoroSessionId: string,
    userId: string
  ) {
    return this.prisma.pomodoroSession.update({
      where: { id: pomodoroSessionId, userId },
      data: dto,
    })
  }

  async deleteSession(pomodoroSessionId: string, userId: string) {
    return this.prisma.pomodoroSession.delete({
      where: { id: pomodoroSessionId, userId },
    })
  }

  async updateRound(
    dto: Partial<PomodoroTimerRoundDto>,
    pomodoroRoundId: string
    // TODO: add pomodoroSessionId
  ) {
    return this.prisma.pomodoroRound.update({
      where: { id: pomodoroRoundId },
      data: dto,
    })
  }
}

import { IsOptional, IsBoolean, IsNumber } from "class-validator"

export class PomodoroTimerSessionDto {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean
}

export class PomodoroTimerRoundDto {
  @IsNumber()
  totalSeconds: number

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean
}

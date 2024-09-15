import { IsOptional, IsString, IsBoolean, IsEnum } from "class-validator"
import { Transform } from "class-transformer"

import { Priority } from "prisma/generated/client"

export class TaskDto {
  @IsString()
  name: string

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean

  @IsOptional()
  @IsEnum(Priority)
  @Transform(({ value }) => ("" + value).toLowerCase())
  priority?: Priority

  // TODO: delete maybe
  // @IsOptional()
  // @IsString()
  // createdAt?: string
}

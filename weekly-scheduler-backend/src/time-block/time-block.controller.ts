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

import { TimeBlockDto } from "./dto/time-block.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { TimeBlockService } from "./time-block.service"

@Controller("user/time-blocks")
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put("update-order")
  @Auth()
  async updateOrder(
    @Body() dto: UpdateOrderDto,
    @CurrentUser("id") userId: string
  ) {
    return this.timeBlockService.updateOrder(dto.ids, userId)
  }

  @Get()
  @Auth()
  async getAll(@CurrentUser("id") userId: string) {
    return this.timeBlockService.getAll(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: TimeBlockDto, @CurrentUser("id") userId: string) {
    return this.timeBlockService.create(dto, userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(":id")
  @Auth()
  async update(
    @Body() dto: Partial<TimeBlockDto>,
    @Param("id") id: string,
    @CurrentUser("id") userId: string
  ) {
    return this.timeBlockService.update(dto, id, userId)
  }

  @HttpCode(200)
  @Delete(":id")
  @Auth()
  async delete(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.timeBlockService.delete(id, userId)
  }
}

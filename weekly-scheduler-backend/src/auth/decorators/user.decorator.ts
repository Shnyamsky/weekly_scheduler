import { createParamDecorator, ExecutionContext } from "@nestjs/common"

import { User } from "@/../prisma/generated/client"

export const currentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user

    return data ? user[data] : user
  }
)

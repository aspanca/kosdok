import { Body, Controller, Get, Patch } from "@nestjs/common";

import { CurrentUser } from "../identity/decorators/current-user.decorator";

import { UpdateMyProfileDto } from "./dto/update-my-profile.dto";
import { UserService } from "./user.service";

import type { AuthUser } from "../../common/types/auth-user.type";

@Controller("me")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  getMyProfile(@CurrentUser() user: AuthUser) {
    return this.userService.getMyProfile(user.id);
  }

  @Patch("profile")
  updateMyProfile(@CurrentUser() user: AuthUser, @Body() payload: UpdateMyProfileDto) {
    return this.userService.updateMyProfile(user.id, payload);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { AuthService } from "./auth.service";
import { AtGuard, RtGuard } from "../common/guards";
import { CurrentUser, Public } from "src/common/decorators";
import { User } from "src/schemas/user.schema";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // @Post('')
  // createUser(@Body() userData: CreateUserDto) {
  //   return this.userService.createUser(userData);
  // }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  createUser(@Body() userData: CreateUserDto) {
    return this.authService.signup(userData);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  singin(@Body() userData: CreateUserDto) {
    return this.authService.signin(userData);
  }

  @HttpCode(HttpStatus.OK)
  @Get("logout")
  logout(@CurrentUser("sub") userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post("/refresh")
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @CurrentUser("sub") userId: string,
    @CurrentUser("sub") user: User,
  ) {
    return this.authService.refreshToken(userId, user.refresh_token);
  }

  // @Get()
  // getUsers() {
  //   return this.userService.getusers();
  // }

  // @Get(":id")
  // getUserById(@Param("id") id: string) {
  //   return this.userService.getUser(id);
  // }

  // @Patch(":id")
  // updateUser(@Param("id") id: string, @Body() userArgs: UpdateUserDto) {
  //   return this.userService.updateUser(id, userArgs);
  // }

  // @Delete(":id")
  // deleteUser(@Param("id") id: string) {
  //   return this.userService.deleteUser(id);
  // }
}

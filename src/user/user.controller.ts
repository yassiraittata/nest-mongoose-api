import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { AuthService } from "./auth.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  // @Post('')
  // createUser(@Body() userData: CreateUserDto) {
  //   return this.userService.createUser(userData);
  // }

  @Post("signup")
  createUser(@Body() userData: CreateUserDto) {
    return this.authService.signup(userData)
  }

  @Get()
  getUsers() {
    return this.userService.getusers();
  }

  @Get(":id")
  getUserById(@Param("id") id: string) {
    return this.userService.getUser(id);
  }

  @Patch(":id")
  updateUser(@Param("id") id: string, @Body() userArgs: UpdateUserDto) {
    return this.userService.updateUser(id, userArgs);
  }

  @Delete(":id")
  deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }
}

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() userData: CreateUserDto) {
    return this.userService.createUser(userData);
  }

  @Get()
  getUsers() {
    return this.userService.getusers();
  }

  @Get(":id")
  getUserById(@Param("id") id: string) {
    return this.userService.getUser(id);
  }
}

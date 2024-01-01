import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/schemas/user.schema";
import { CreateUserDto } from "./dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModal: Model<User>) {}

  async createUser(userData: CreateUserDto) {
    const userExisit = await this.userModal.findOne({
      username: userData.username,
    });
    if (userExisit) {
      return new BadRequestException("User already exists");
    }

    const user = new this.userModal(userData);
    await user.save();
    return user;
  }

  async getusers() {
    return await this.userModal.find();
  }

  async getUser(id: string) {
    const validId = Types.ObjectId.isValid(id);

    if (!validId) {
      throw new NotFoundException("No user was found! id validation");
    }

    const user = await this.userModal.findById(id);

    if (!user) {
      throw new NotFoundException("No user was found!");
    }

    return user;
  }
}

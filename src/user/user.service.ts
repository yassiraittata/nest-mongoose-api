import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/schemas/user.schema";
import { CreateUserDto } from "./dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModal: Model<User>) {}

  async createUser(userData: CreateUserDto) {
    const userExisit = await this.userModal.findOne({
      username: userData.username,
    });
    if (userExisit) {
      throw new BadRequestException("User already exists");
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

  async updateUser(id: string, userArgs: Partial<User>) {
    const isIdValid = Types.ObjectId.isValid(id);

    if (!isIdValid) throw new NotFoundException("USer was not found");

    const user = await this.userModal.findById(id);

    if (!user) throw new NotFoundException("User was not found");

    Object.assign(user, userArgs);

    await user.save();

    return user;
  }

  async deleteUser(id: string) {
    const isIdValid = Types.ObjectId.isValid(id);
    if (!isIdValid) throw new NotFoundException("USer was not found");

    await this.userModal.deleteOne({ id });
  }
}

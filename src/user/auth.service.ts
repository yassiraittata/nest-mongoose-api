import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModal: Model<User>,
    private readonly jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(userData: CreateUserDto) {
    const userExist = await this.userModal.findOne({
      username: userData.username,
    });
    if (userExist) {
      throw new BadRequestException("User already exists");
    }

    const hash = await this.hashData(userData.password);

    const user = new this.userModal({
      username: userData.username,
      email: userData.email,
      password: hash,
    });

    const { access_token, refresh_token } = await this.signToken(
      user.id,
      user.username,
      user.email,
    );

    const hashedRt = await this.hashData(refresh_token);

    user.refresh_token = hashedRt;

    await user.save();
    return { access_token, refresh_token };
  }

  signin() {}

  logout() {}

  private hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 12);
  }

  private async signToken(userId: string, username: string, email: string) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email,
          username,
        },
        {
          secret: this.config.get("AT_SECRET"),
          expiresIn: 60 * 15,
        },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          email,
          username,
        },
        {
          secret: this.config.get("RT_SECRET"),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}

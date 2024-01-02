import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
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
      throw new BadRequestException("User already exists!");
    }

    // hash the password
    const hash = await this.hashData(userData.password);

    // create the user
    const user = new this.userModal({
      username: userData.username,
      email: userData.email,
      password: hash,
    });

    // create tokens
    const { access_token, refresh_token } = await this.signToken(
      user.id,
      user.username,
      user.email,
    );

    // hash ans store the token
    const hashedRt = await this.hashData(refresh_token);

    user.refresh_token = hashedRt;
    await user.save();

    // return tokens
    return { access_token, refresh_token };
  }

  async signin(userData: CreateUserDto) {
    const user = await this.userModal.findOne({ email: userData.email });
    if (!user) {
      throw new NotFoundException("User was not found");
    }

    const isPwMatch = await bcrypt.compare(userData.password, user.password);

    if (!isPwMatch) {
      throw new NotFoundException("Incorrect password!");
    }

    // create tokens
    const { access_token, refresh_token } = await this.signToken(
      user.id,
      user.username,
      user.email,
    );

    // hash ans store the token
    const hashedRt = await this.hashData(refresh_token);

    user.refresh_token = hashedRt;
    await user.save();

    return {
      access_token,
      refresh_token,
      user: user.toObject({
        transform: (doc, ret, options) => {
          delete ret.password;
          delete ret.refresh_token;
          ret.id = ret._id;
          delete ret._id;
          return ret;
        },
      }),
    };
  }

  async logout(userId: string) {
    const validId = Types.ObjectId.isValid(userId);

    if (!validId) {
      throw new NotFoundException("No user was found! id validation");
    }

    const user = await this.userModal.findOne({
      _id: userId,
      refresh_token: { $ne: null },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    user.refresh_token = null;

    await user.save();
  }

  async refreshToken(userId: string, token: string) {
    const validId = Types.ObjectId.isValid(userId);

    if (!validId) {
      throw new NotFoundException("No user was found! id validation");
    }

    const user = await this.userModal.findById(userId);

    if (!user) {
      throw new NotFoundException("No user was found! id validation");
    }

    const rtMatch = await bcrypt.compare(token, user.refresh_token);

    if (!rtMatch) {
      throw new ForbiddenException("Unauthenticated!");
    }

    const { access_token, refresh_token } = await this.signToken(
      user.id,
      user.username,
      user.email,
    );

    return { access_token, refresh_token };
  }

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

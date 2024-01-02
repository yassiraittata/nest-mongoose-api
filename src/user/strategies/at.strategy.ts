import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type PayloadType = {
  sub: string;
  email: string;
  username: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("AT_SECRET"),
    });
  }

  validate(payload: PayloadType) {
    return payload;
  }
}

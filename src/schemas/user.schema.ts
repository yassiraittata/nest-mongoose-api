import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refresh_token?: string;

  @Prop([{ type: mongoose.Types.ObjectId, ref: "Post" }])
  prefrencePosts: string[];

  @Prop([{ type: mongoose.Types.ObjectId, ref: "Post" }])
  savedPosts: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

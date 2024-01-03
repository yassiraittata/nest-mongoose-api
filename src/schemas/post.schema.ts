import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: "User" })
  creator: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);

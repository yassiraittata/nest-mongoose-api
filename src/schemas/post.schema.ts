import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: "User" })
  creator: string;

  @Prop([{ type: mongoose.Types.ObjectId, ref: "User" }])
  likes: string[];

  @Prop([{ type: mongoose.Types.ObjectId, ref: "User" }])
  savedBy: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

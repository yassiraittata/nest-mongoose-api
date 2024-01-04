import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Post } from "src/schemas/post.schema";
import { User } from "src/schemas/user.schema";

@Injectable()
export class PreferenceService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async likePost(postId: string, userId: string) {
    const isPostIdValid = Types.ObjectId.isValid(postId);
    if (!isPostIdValid) throw new NotFoundException("No post was found");

    const isUserIdValid = Types.ObjectId.isValid(userId);
    if (!isUserIdValid) throw new NotFoundException("No User was found");

    const post = await this.postModel.findById(postId);
    const user = await this.postModel.findById(userId);

    if (!post) throw new NotFoundException("Post was not found!");
    if (!user) throw new NotFoundException("User was not found!");

    user.likes.push(post.id);

    await user.save();
  }

  async getLikedPost(userId: string) {
    const isUserIdValid = Types.ObjectId.isValid(userId);
    if (!isUserIdValid) throw new NotFoundException("No User was found");

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User was not found!");

    const posts = await this.postModel
      .find()
      .where("_id")
      .in(user.prefrencePosts);

    return posts;
  }
}

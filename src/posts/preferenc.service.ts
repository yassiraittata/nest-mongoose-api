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
    const user = await this.userModel.findById(userId);

    if (!post) throw new NotFoundException("Post was not found!");
    if (!user) throw new NotFoundException("User was not found!");

    const isUserLikedPost = user.prefrencePosts.find((el) => el === post.id);
    const isPostLiked = post.likes.find((el) => el === user.id);

    if (!isUserLikedPost) {
      user.prefrencePosts.push(post.id);
      await user.save();
    }

    if (!isPostLiked) {
      post.likes.push(user.id);
      await post.save();
    }
  }

  async unlikePost(postId: string, userId: string) {
    const isPostIdValid = Types.ObjectId.isValid(postId);
    if (!isPostIdValid) throw new NotFoundException("No post was found");

    const isUserIdValid = Types.ObjectId.isValid(userId);
    if (!isUserIdValid) throw new NotFoundException("No User was found");

    const post = await this.postModel.findById(postId);
    const user = await this.userModel.findById(userId);

    if (!post) throw new NotFoundException("Post was not found!");
    if (!user) throw new NotFoundException("User was not found!");

    const postLikeIndex = post.likes.findIndex((el) => el === user.id);
    post.likes.splice(postLikeIndex, 1);

    const userLikeIndex = user.prefrencePosts.findIndex((el) => el === user.id);
    user.prefrencePosts.splice(userLikeIndex, 1);

    await post.save();
    await user.save();
  }

  async getLikedPosts(userId: string) {
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

  async savePost(postId: string, userId: string) {
    const isPostIdValid = Types.ObjectId.isValid(postId);
    if (!isPostIdValid) throw new NotFoundException("No post was found");

    const isUserIdValid = Types.ObjectId.isValid(userId);
    if (!isUserIdValid) throw new NotFoundException("No User was found");

    const post = await this.postModel.findById(postId);
    const user = await this.userModel.findById(userId);

    if (!post) throw new NotFoundException("Post was not found!");
    if (!user) throw new NotFoundException("User was not found!");

    const isUserSavedPost = user.savedPosts.find((el) => el === post.id);
    const isPostSaved = post.savedBy.find((el) => el === user.id);

    if (!isUserSavedPost) {
      user.savedPosts.push(post.id);
      await user.save();
    }

    if (!isPostSaved) {
      post.savedBy.push(user.id);
      await post.save();
    }
  }

  async getSavedPosts(userId: string) {
    const isUserIdValid = Types.ObjectId.isValid(userId);
    if (!isUserIdValid) throw new NotFoundException("No User was found");

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User was not found!");

    const posts = await this.postModel.find().where("_id").in(user.savedPosts);

    return posts;
  }
}

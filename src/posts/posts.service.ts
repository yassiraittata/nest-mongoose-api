import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Post } from "src/schemas/post.schema";

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(title: string, text: string, userId: string) {
    const newPost = new this.postModel({
      title: title,
      text: text,
      creator: userId,
    });

    await newPost.save();
    return newPost;
  }

  async getAllPosts(userId: string) {
    const posts = await this.postModel.find();
    return posts;
  }

  async getPostsByUser(userId: string) {
    const posts = await this.postModel.find({ creator: userId });
    return posts;
  }

  async updatePost(postId: string, userId: string, args: Partial<Post>) {
    const isIdValid = Types.ObjectId.isValid(postId);
    if (!isIdValid) throw new NotFoundException("No post was found");

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException("No post was found");

    if (post.creator !== userId) {
      throw new UnauthorizedException("You can't update this post");
    }

    Object.assign(post, args);

    await post.save();
  }

  async deletePost(title: string, text: string, userId: string) {}
}

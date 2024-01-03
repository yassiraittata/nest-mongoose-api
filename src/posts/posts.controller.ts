import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { CreatePostDto, UpdatePostDto } from "./dto";
import { CurrentUser } from "src/common/decorators";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createPost(
    @Body() postData: CreatePostDto,
    @CurrentUser("sub") userId: string,
  ) {
    return this.postService.createPost(postData.title, postData.text, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post(":id")
  UpdatePost(
    @Param("id") id: string,
    @Body() postData: UpdatePostDto,
    @CurrentUser("sub") userId: string,
  ) {
    return this.postService.updatePost(id, userId, postData);
  }
}

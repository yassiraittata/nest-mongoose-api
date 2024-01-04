import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { CreatePostDto, UpdatePostDto } from "./dto";
import { CurrentUser } from "src/common/decorators";
import { PostsService } from "./posts.service";
import { PreferenceService } from "./preferenc.service";

@Controller("posts")
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly preferenceService: PreferenceService,
  ) {}

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

  @HttpCode(HttpStatus.OK)
  @Get("user")
  getUserPosts(@CurrentUser("sub") userId: string) {
    return this.postService.getPostsByUser(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get("like/:id")
  likePost(@Param("id") postId: string, @CurrentUser("sub") userId: string) {
    return this.preferenceService.likePost(postId, userId);
  }
}

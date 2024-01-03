import { Body, Controller } from "@nestjs/common";
import { CreatePostDto } from "./dto";
import { CurrentUser } from "src/common/decorators";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  createPost(
    @Body() postData: CreatePostDto,
    @CurrentUser("sub") userId: string,
  ) {
    return this.postService.createPost(postData.title, postData.text, userId);
  }
}

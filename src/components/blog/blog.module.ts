import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/model/blog.model';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { BlogRepository } from 'src/repositories/blog.repository';
import { ReactionModule } from '../reaction/reaction.module';
import { Reaction, ReactionSchema } from 'src/model/reaction.model';
import { Comment, CommentSchema } from 'src/model/comment.model';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Reaction.name, schema: ReactionSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    CloudinaryModule,
    ReactionModule,
    CommentModule
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
  exports: [BlogService, BlogRepository]
})
export class BlogModule { }

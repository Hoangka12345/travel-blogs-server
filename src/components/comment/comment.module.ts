import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/model/comment.model';
import { Blog, BlogSchema } from 'src/model/blog.model';
import { CommentRepository } from 'src/repositories/comment.repository';
import { BlogModule } from '../blog/blog.module';
import { BlogRepository } from 'src/repositories/blog.repository';
import { Notification, NotificationSchema } from 'src/model/notification.model';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, BlogRepository],
  exports: [CommentService, CommentRepository]
})
export class CommentModule { }

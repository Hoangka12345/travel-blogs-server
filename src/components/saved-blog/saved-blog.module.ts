import { Module } from '@nestjs/common';
import { SavedBlogController } from './saved-blog.controller';
import { SavedBlogService } from './saved-blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedBlog, SavedBlogSchema } from 'src/model/saved-blog.model';
import { SavedBlogRepository } from 'src/repositories/saved-blog.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavedBlog.name, schema: SavedBlogSchema }
    ]),
  ],
  controllers: [SavedBlogController],
  providers: [SavedBlogService, SavedBlogRepository],
  exports: [SavedBlogService, SavedBlogRepository]
})
export class SavedBlogModule { }

import { Module } from '@nestjs/common';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { ReactionRepository } from 'src/repositories/reaction.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from 'src/model/reaction.model';
import { BlogRepository } from 'src/repositories/blog.repository';
import { Blog, BlogSchema } from 'src/model/blog.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [ReactionController],
  providers: [ReactionService, ReactionRepository, BlogRepository],
  exports: [ReactionService, ReactionRepository]
})
export class ReactionModule { }

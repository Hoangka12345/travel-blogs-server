import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReactionRepository } from 'src/repositories/reaction.repository';
import { I_Response } from '../../interfaces/response-data.interface';
import { Reaction } from 'src/model/reaction.model';
import { BlogRepository } from 'src/repositories/blog.repository';

@Injectable()
export class ReactionService {
    constructor(
        private readonly reactionRepo: ReactionRepository,
        private readonly blogRepo: BlogRepository,
    ) { }

    async countReactions(blogId: string): Promise<number> {
        try {
            const numberOfReactions = await this.reactionRepo.count({ blogId })
            return numberOfReactions
        } catch (error) {
            console.log(">>> error when count reactions: ", error);
            throw new InternalServerErrorException
        }
    }

    private async reactionInfo(userId: string, blogId: string): Promise<Reaction> {
        try {
            const reaction = await this.reactionRepo.findOneByCondition({ userId, blogId })
            if (reaction) {
                return reaction
            } return null
        } catch (error) {
            console.log(">>> getting error when find reaction: ", error);
            throw new InternalServerErrorException
        }
    }

    async createReaction(userId: string, blogId: string): Promise<I_Response<Reaction>> {
        const reactionInfo = await this.reactionInfo(userId, blogId)
        const blogInfo = await this.blogRepo.getBlogDetail(blogId)
        if (reactionInfo || !blogInfo) {
            throw new HttpException("Không thể thích bài viết này!", HttpStatus.CONFLICT)
        }
        try {
            const reaction = await this.reactionRepo.create({ userId, blogId })
            if (reaction) {
                return {
                    statusCode: HttpStatus.OK,
                    data: reaction
                }
            }
        } catch (error) {
            console.log(">>> error when create reaction: ", error);
            throw new InternalServerErrorException
        }
    }

    async removeReaction(userId: string, blogId: string): Promise<I_Response<Reaction>> {
        const reactionInfo = await this.reactionInfo(userId, blogId)
        if (!reactionInfo) {
            throw new HttpException("Bạn chưa thích blog này trước đó!", HttpStatus.CONFLICT)
        }
        try {
            const { _id } = reactionInfo
            const reaction = await this.reactionRepo.deleteById(_id)
            if (reaction) {
                return {
                    statusCode: HttpStatus.OK,
                }
            }
        } catch (error) {
            console.log(">>> error when create reaction: ", error);
            throw new InternalServerErrorException
        }
    }
}

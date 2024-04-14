import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Comment } from 'src/model/comment.model';
import { BlogRepository } from 'src/repositories/blog.repository';
import { CommentRepository } from 'src/repositories/comment.repository';
import { I_Response } from '../../interfaces/response-data.interface';
import { CommentDto } from './dto/comment.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepo: CommentRepository,
        private readonly blogRepo: BlogRepository,
    ) { }

    async countComments(blogId: string): Promise<number> {
        try {
            const commentCount = await this.commentRepo.count({ blogId })
            return commentCount
        } catch (error) {
            console.log(">>> error when count comments: ", error);
            throw new InternalServerErrorException
        }
    }

    async getCommentsByBlog(blogId: string): Promise<any> {
        try {
            const comments = await this.commentRepo.getCommentsByBlog(blogId)
            if (comments) {
                const newComments = comments.map(comment => {
                    const { userId, ...rest } = comment.toObject()
                    return {
                        ...rest,
                        user: userId
                    }
                })

                return newComments
            }
        } catch (error) {
            console.log(">>> error when count comments: ", error);
            throw new InternalServerErrorException
        }
    }

    async createComment(userId: string, data: CommentDto): Promise<I_Response<Comment>> {
        const blogInfo = await this.blogRepo.getBlogDetail(data.blogId)
        if (!blogInfo) {
            throw new HttpException("Bài blog không tồn tại!", HttpStatus.CONFLICT)
        }
        try {
            const comment = await this.commentRepo.create({ userId, ...data })
            if (comment) {
                return {
                    statusCode: HttpStatus.OK,
                    data: comment
                }
            }
        } catch (error) {
            console.log(">>> error when create reaction: ", error);
            throw new InternalServerErrorException
        }
    }

    private async getCommentInfo(userId: string, commentId: string): Promise<Comment> {
        try {
            const reaction = await this.commentRepo.findOneByCondition({ userId, _id: commentId })
            if (reaction) {
                return reaction
            } return null
        } catch (error) {
            console.log(">>> getting error when find reaction: ", error);
            throw new InternalServerErrorException
        }
    }

    async removeComment(userId: string, commentId: string): Promise<I_Response<Comment>> {
        const commentInfo = await this.getCommentInfo(userId, commentId)
        if (!commentInfo) {
            throw new HttpException("comment này không tồn tại!", HttpStatus.CONFLICT)
        }
        try {
            const reaction = await this.commentRepo.deleteById(commentId)
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

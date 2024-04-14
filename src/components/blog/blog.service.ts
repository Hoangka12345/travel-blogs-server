import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { BlogDto } from './dto/blog.dto';
import { I_Response } from '../../interfaces/response-data.interface';
import { Blog } from 'src/model/blog.model';
import { BlogRepository } from 'src/repositories/blog.repository';
import { ReactionService } from '../reaction/reaction.service';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class BlogService {
    constructor(
        private readonly blogRepo: BlogRepository,
        private readonly reactionService: ReactionService,
        private readonly commentService: CommentService,
    ) { }

    convertLetter(string: string) {
        return string
            .replace(/a/g, '[a,á,à,ã,ả,ạ,ă,ắ,ặ,ằ,ẳ,ẵ,â,ấ,ầ,ẩ,ẫ,ậ]')
            .replace(/e/g, '[e,é,è,ẻ,ẽ,ẹ,ê,ế,ề,ể,ễ,ệ]')
            .replace(/i/g, '[i,í,ì,ỉ,ĩ,ị]')
            .replace(/o/g, '[o,ó,ò,ỏ,õ,ọ,ô,ố,ồ,ổ,ỗ,ộ,ơ,ớ,ờ,ở,ỡ,ợ]')
            .replace(/u/g, '[u,ú,ù,ủ,ũ,ụ,ư,ứ,ừ,ử,ữ,ự]')
            .replace(/y/g, '[y,ý,ỳ,ỷ,ỹ,ỵ]')
            .replace(/d/g, '[d,đ]');
    }

    async getBlogs(page: number, search: string = ""): Promise<I_Response<any>> {
        const regex = this.convertLetter(search)

        try {
            const blogs = await this.blogRepo.getBlogs(regex, page)

            if (blogs[0]) {
                const newBlogs = await Promise.all(
                    blogs.map(async (blog) => {
                        const reactionCount = await this.reactionService.countReactions(blog._id);
                        const commentCount = await this.commentService.countComments(blog._id)
                        const comments = await this.commentService.getCommentsByBlog(blog._id)

                        const { userId, ...rest } = blog
                        return {
                            ...rest,
                            user: userId,
                            reactionCount,
                            commentCount,
                            comments
                        };
                    })
                )
                return {
                    statusCode: HttpStatus.OK,
                    data: {
                        blogs: newBlogs,
                        pageNumber: Math.ceil(newBlogs.length / 5)
                    }
                }
            } return {
                statusCode: HttpStatus.OK,
                data: []
            }
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new HttpException("Lỗi server", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getBlogsWhenLogin(userId: string, page: number, search: string = ""): Promise<I_Response<any>> {
        const regex = this.convertLetter(search)
        try {
            const blogs = await this.blogRepo.getBlogsWhenLogin(regex, userId, page)

            if (blogs[0]) {
                const newBlogs = await Promise.all(
                    blogs.map(async (blog) => {
                        const reactionCount = await this.reactionService.countReactions(blog._id);
                        const commentCount = await this.commentService.countComments(blog._id)
                        const comments = await this.commentService.getCommentsByBlog(blog._id)
                        return {
                            ...blog,
                            reactionCount,
                            commentCount,
                            comments
                        };
                    })
                )
                return {
                    statusCode: HttpStatus.OK,
                    data: {
                        blogs: newBlogs,
                        pageNumber: Math.ceil(newBlogs.length / 5)
                    }
                }
            } return {
                statusCode: HttpStatus.OK,
                data: []
            }
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new InternalServerErrorException
        }
    }

    async getBlogsOfUser(userId: string, page: number = 1): Promise<any> {
        try {
            const blogs = await this.blogRepo.getBlogsOfUser(page, userId)
            if (blogs[0]) {
                const newBlogs = await Promise.all(
                    blogs.map(async (blog) => {
                        const reactionCount = await this.reactionService.countReactions(blog._id);
                        const commentCount = await this.commentService.countComments(blog._id)
                        const comments = await this.commentService.getCommentsByBlog(blog._id)
                        const { userId, ...rest } = blog.toObject()
                        return {
                            ...rest,
                            user: userId,
                            reactionCount,
                            commentCount,
                            comments
                        };
                    })
                )
                return {
                    blogs: newBlogs,
                    pageNumber: Math.ceil(newBlogs.length / 5)
                }
            } return []
        } catch (error) {
            console.log(">>> getting err when trying to get blogs of user: ", error);
            throw new InternalServerErrorException
        }
    }

    async getBlogsOfUserWhenLogin(userId: string, profileUserId: string, page: number = 1): Promise<any> {
        try {
            const blogs = await this.blogRepo.getBlogsOfUserWhenLogin(page, profileUserId, userId)
            if (blogs[0]) {
                const newBlogs = await Promise.all(
                    blogs.map(async (blog) => {
                        const reactionCount = await this.reactionService.countReactions(blog._id);
                        const commentCount = await this.commentService.countComments(blog._id)
                        const comments = await this.commentService.getCommentsByBlog(blog._id)
                        return {
                            ...blog,
                            reactionCount,
                            commentCount,
                            comments
                        };
                    })
                )
                return {
                    blogs: newBlogs,
                    pageNumber: Math.ceil(newBlogs.length / 5)
                }
            } return []
        } catch (error) {
            console.log(">>> getting err when trying to get blogs of user after login: ", error);
            throw new InternalServerErrorException
        }
    }

    async getBlogDetail(blogId: string): Promise<I_Response<any>> {
        try {
            const blog = await this.blogRepo.getBlogDetail(blogId)
            if (blog) {
                const reactionCount = await this.reactionService.countReactions(blogId)
                const commentCount = await this.commentService.countComments(blogId)
                const comments = await this.commentService.getCommentsByBlog(blogId)
                const { userId, ...rest } = blog.toObject()
                return {
                    statusCode: HttpStatus.OK,
                    data: {
                        ...rest,
                        user: userId,
                        reactionCount,
                        commentCount,
                        comments
                    }
                }
            }
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new ConflictException
        }
    }

    async getBlogDetailWhenLogin(blogId: string, userId: string): Promise<I_Response<any>> {
        try {
            const blogs = await this.blogRepo.getBlogDetailWhenLogin(blogId, userId)
            if (blogs[0]) {
                const reactionCount = await this.reactionService.countReactions(blogId)
                const commentCount = await this.commentService.countComments(blogId)
                const comments = await this.commentService.getCommentsByBlog(blogId)
                return {
                    statusCode: HttpStatus.OK,
                    data: {
                        ...blogs[0],
                        reactionCount,
                        commentCount,
                        comments
                    }
                }
            } throw new ConflictException
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new ConflictException
        }
    }

    async createNewBlog(data: BlogDto, userId: string, images: string[] = []): Promise<I_Response<Blog>> {
        try {
            const newBlog = await this.blogRepo.create({ ...data, userId, images })
            if (newBlog) {
                return {
                    statusCode: HttpStatus.OK,
                    data: newBlog
                }
            } throw new InternalServerErrorException

        } catch (error) {
            console.log(">>> getting err when trying to create blog ", error);
            throw new InternalServerErrorException
        }
    }
}

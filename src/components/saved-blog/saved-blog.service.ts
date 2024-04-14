import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SavedBlogRepository } from 'src/repositories/saved-blog.repository';
import { I_Response } from '../../interfaces/response-data.interface';
import { SavedBlog } from 'src/model/saved-blog.model';

@Injectable()
export class SavedBlogService {
    constructor(
        private readonly savedBlogRepo: SavedBlogRepository
    ) { }

    async getSavedBlogs(userId: string, page: number = 1): Promise<I_Response<any>> {
        try {
            const savedBlogs = await this.savedBlogRepo.getSavedBlogs(userId, page)
            if (savedBlogs[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: {
                        blogs: savedBlogs,
                        blogsNumber: savedBlogs.length
                    }
                }
            } return {
                statusCode: HttpStatus.OK,
                data: {
                    blogs: [],
                    blogsNumber: 0
                }
            }
        } catch (error) {
            console.log(">>> error when get saved blogs: ", error);
            throw new InternalServerErrorException
        }
    }

    async createSavedBlog(userId: string, blogId: string): Promise<I_Response<SavedBlog>> {
        try {
            const savedBlog = await this.savedBlogRepo.create({ userId, blogId })
            if (savedBlog) {
                return {
                    statusCode: HttpStatus.OK,
                    data: savedBlog
                }
            }
        } catch (error) {
            console.log(">>> error when create saved blogs: ", error);
            throw new InternalServerErrorException
        }
    }

    private async checkSavedBlogInfo(userId: string, savedBlogId: string): Promise<SavedBlog> {
        try {
            const savedBlog = await this.savedBlogRepo.findOneByCondition({ _id: savedBlogId, userId })
            if (savedBlog) {
                return savedBlog
            } return null
        } catch (error) {
            console.log(">>> error when check saved blogs info: ", error);
            throw new InternalServerErrorException
        }
    }

    async removeSavedBlog(userId: string, savedBlogId: string): Promise<I_Response<SavedBlog>> {
        const savedBlogInfo = await this.checkSavedBlogInfo(userId, savedBlogId)
        if (!savedBlogInfo) {
            throw new HttpException('Bài blog này chưa được lưu!', HttpStatus.CONFLICT)
        }
        try {
            const savedBlog = await this.savedBlogRepo.deleteById(savedBlogId)
            if (savedBlog) {
                return {
                    statusCode: HttpStatus.OK,
                }
            }
        } catch (error) {
            console.log(">>> error when delete saved blogs: ", error);
            throw new InternalServerErrorException
        }
    }
}

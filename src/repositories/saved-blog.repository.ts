import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { SavedBlog } from "src/model/saved-blog.model";
import { populate } from "dotenv";

@Injectable()
export class SavedBlogRepository extends BaseRepository<SavedBlog> {
    constructor(
        @InjectModel(SavedBlog.name)
        private readonly savedBlogModel: Model<SavedBlog>
    ) {
        super(savedBlogModel)
    }

    async getSavedBlogs(userId: string, page: number = 1): Promise<SavedBlog[]> {
        return await this.savedBlogModel.find({ userId })
            .populate({
                path: 'blogId',
                select: ['address', 'createdAt'],
                populate: {
                    path: 'userId',
                    select: ['fullName']
                }
            })
            .skip((page - 1) * 5)
            .limit(5)
            .exec()
    }
}
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { SavedBlog } from "src/model/saved-blog.model";

@Injectable()
export class SavedBlogRepository extends BaseRepository<SavedBlog> {
    constructor(
        @InjectModel(SavedBlog.name)
        private readonly savedBlogModel: Model<SavedBlog>
    ) {
        super(savedBlogModel)
    }

    async getSavedBlogs(userId: string): Promise<SavedBlog[]> {
        return await this.savedBlogModel.find({ userId })
            .populate("userId", ['fullName'])
            .populate('blogId', ['address', 'createdAt'])
            .exec()
    }
}
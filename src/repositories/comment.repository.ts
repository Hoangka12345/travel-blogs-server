import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { Comment } from "src/model/comment.model";

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel: Model<Comment>
    ) {
        super(commentModel)
    }

    async getCommentsByBlog(blogId: string): Promise<Comment[]> {
        return await this.commentModel.find({ blogId })
            .populate('userId', ['_id', 'fullName', 'avatar'])
    }
}
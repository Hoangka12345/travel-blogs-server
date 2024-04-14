import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User } from "src/model/user.model";
import { BaseRepository } from "./base.repository";

@Injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) {
        super(userModel)
    }

    async getTopContributors(): Promise<User[]> {
        return await this.userModel.aggregate([
            {
                $lookup: {
                    from: "blogs",
                    localField: "_id",
                    foreignField: "userId",
                    as: "blogs"
                }
            },
            {
                $addFields: {
                    totalBlogs: { $size: "$blogs" }
                }
            },
            {
                $match: {
                    totalBlogs: { $gt: 0 } // Chỉ chọn những người dùng có ít nhất một blog
                }
            },
            {
                $sort: { totalBlogs: -1 }
            },
            {
                $project: {
                    fullName: 1,
                    avatar: 1,
                    createdAt: 1,
                    totalBlogs: 1
                }
            },
            {
                $limit: 5
            }
        ]);
    }

}
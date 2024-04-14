import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { Blog } from "src/model/blog.model";

@Injectable()
export class BlogRepository extends BaseRepository<Blog> {
    constructor(
        @InjectModel(Blog.name)
        private readonly blogModel: Model<Blog>
    ) {
        super(blogModel)
    }
    async getBlogs(regex: string, page: number = 1): Promise<Blog[]> {
        return await this.blogModel.find(
            {
                address: { $regex: regex, $options: 'i' }
            }
        )
            .skip((page - 1) * 5)
            .limit(5)
            .lean()
            .populate({
                path: 'userId',
                select: ['_id', 'fullName', 'avatar'],
                model: 'User',
            })
            .sort({ createdAt: -1 })
            .exec();
    }

    async getBlogsWhenLogin(regex: string, userId: string, page: number): Promise<Blog[]> {
        return await this.blogModel.aggregate([
            {
                $match: {
                    address: { $regex: regex, $options: 'i' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: "$user"
            },
            {
                $addFields: {
                    userId: new mongoose.Types.ObjectId(userId),
                },
            },
            // join saved blog to check is saved ?
            {
                $lookup: {
                    from: 'savedblogs',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'savedBlogInfo',
                },
            },
            {
                $unwind: {
                    path: '$savedBlogInfo',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $addFields: {
                    isSaved: {
                        $eq: ['$_id', '$savedBlogInfo.blogId'],
                    },
                },
            },
            // join reaction to check is like ?
            {
                $lookup: {
                    from: 'reactions',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'reactionInfo',
                },
            },
            {
                $unwind: {
                    path: '$reactionInfo',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $addFields: {
                    isLiked: {
                        $eq: ['$_id', '$reactionInfo.blogId'],
                    },
                },
            },
            {
                $project: {
                    userId: 0,
                    savedBlogInfo: 0,
                    reactionInfo: 0
                },
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: (page - 1) * 5
            },
            {
                $limit: 5
            },
        ]).exec()
    }

    async getBlogsOfUser(page: number = 1, userId: string): Promise<Blog[]> {
        return await this.blogModel.find(
            {
                userId,
            }
        )
            .skip((page - 1) * 5)
            .limit(5)
            .populate('userId', ['_id', 'fullName', 'avatar']).exec();
    }

    async getBlogsOfUserWhenLogin(page: number = 1, profileUserId: string, userId: string): Promise<Blog[]> {
        return await this.blogModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(profileUserId),
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: "$user"
            },
            {
                $addFields: {
                    userId: new mongoose.Types.ObjectId(userId),
                },
            },
            // join saved blog to check is saved ?
            {
                $lookup: {
                    from: 'savedblogs',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'savedBlogInfo',
                },
            },
            {
                $unwind: {
                    path: '$savedBlogInfo',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $addFields: {
                    isSaved: {
                        $eq: ['$_id', '$savedBlogInfo.blogId'],
                    },
                },
            },
            // join reaction to check is like ?
            {
                $lookup: {
                    from: 'reactions',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'reactionInfo',
                },
            },
            {
                $unwind: {
                    path: '$reactionInfo',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $addFields: {
                    isLiked: {
                        $eq: ['$_id', '$reactionInfo.blogId'],
                    },
                },
            },
            {
                $project: {
                    userid: 0,
                    userId: 0,
                    savedBlogInfo: 0,
                    reactionInfo: 0
                },
            },
            {
                $skip: (page - 1) * 5
            },
            {
                $limit: 5
            },
            {
                $sort: { createdAt: -1 }
            }
        ]).exec()
    }

    async getBlogDetail(blogId: string): Promise<Blog> {
        return await this.blogModel.findById(blogId)
            .populate('userId', ['_id', 'fullName', 'avatar'], 'User')
    }

    async getBlogDetailWhenLogin(blogId: string, userId: string): Promise<Blog[]> {
        return await this.blogModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(blogId),
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: "$user"
            },
            {
                $addFields: {
                    userId: new mongoose.Types.ObjectId(userId),
                },
            },
            // join saved blog to check is saved ?
            {
                $lookup: {
                    from: 'savedblogs',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'savedBlogInfo',
                },
            },
            {
                $unwind: {
                    path: '$savedBlogInfo',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $addFields: {
                    isSaved: {
                        $eq: ['$_id', '$savedBlogInfo.blogId'],
                    },
                },
            },
            // join reaction to check is like ?
            {
                $lookup: {
                    from: 'reactions',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'reactionInfo',
                },
            },
            {
                $unwind: {
                    path: '$reactionInfo',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $addFields: {
                    isLiked: {
                        $eq: ['$_id', '$reactionInfo.blogId'],
                    },
                },
            },
            {
                $project: {
                    userid: 0,
                    userId: 0,
                    savedBlogInfo: 0,
                    reactionInfo: 0
                },
            }
        ]).exec()
    }
}
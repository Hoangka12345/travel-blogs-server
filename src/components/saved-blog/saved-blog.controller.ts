import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { SavedBlogService } from './saved-blog.service';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from 'src/guards/verify_token.guard';

@Controller('saved-blog')
export class SavedBlogController {
    constructor(private readonly savedBlogService: SavedBlogService) { }

    @UseGuards(AuthGuard)
    @Get()
    getSavedBlogs(
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.savedBlogService.getSavedBlogs(_id)
    }

    @UseGuards(AuthGuard)
    @Post()
    createSavedBlog(
        @Body('blogId') blogId: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']

        return this.savedBlogService.createSavedBlog(_id, blogId)
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    removeSavedBlog(
        @Param('id') savedBlogId: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']

        return this.savedBlogService.removeSavedBlog(_id, savedBlogId)
    }
}

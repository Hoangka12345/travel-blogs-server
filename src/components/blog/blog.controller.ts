import { Body, Controller, Get, Param, Post, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from 'src/guards/verify_token.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BlogDto } from './dto/blog.dto';
import { Request as ExpressRequest } from 'express'

@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService,
        private readonly cloudinatyService: CloudinaryService
    ) { }

    @Get()
    getBlogs(@Query('page') page: number, @Query('search') search: string) {
        return this.blogService.getBlogs(page, search)
    }

    @UseGuards(AuthGuard)
    @Get('user')
    getBlogsWhenLogin(
        @Query('page') page: number,
        @Query('search') search: string,
        @Request() request: ExpressRequest
    ) {

        const { _id } = request['user']
        return this.blogService.getBlogsWhenLogin(_id, page, search)
    }

    @Get(':id')
    getBlogDetail(
        @Param('id') blogId: string,
    ) {
        return this.blogService.getBlogDetail(blogId)
    }

    @UseGuards(AuthGuard)
    @Get('login/:id')
    getBlogDetailWhenLogin(
        @Param('id') blogId: string,
        @Request() request: ExpressRequest,
    ) {
        const { _id } = request['user']
        return this.blogService.getBlogDetailWhenLogin(blogId, _id)
    }

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async createNewBlog(
        @Body() data: BlogDto,
        @Request() request: ExpressRequest,
        @UploadedFiles() images?: Array<Express.Multer.File>,
    ) {
        const { _id } = request['user']
        if (images[0]) {
            const imagesUpload = await this.cloudinatyService.uploadBlogFiles(images)
            return this.blogService.createNewBlog(data, _id, imagesUpload)
        } else {
            return this.blogService.createNewBlog(data, _id)
        }
    }
}

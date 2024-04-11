import { Body, Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/verify_token.guard';
import { CommentService } from './comment.service';
import { Request as ExpressRequest } from 'express';
import { CommentDto } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @UseGuards(AuthGuard)
    @Post()
    createComment(
        @Body() data: CommentDto,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']

        return this.commentService.createComment(_id, data)
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    removeReaction(
        @Param('id') commentId: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']

        return this.commentService.removeComment(_id, commentId)
    }
}

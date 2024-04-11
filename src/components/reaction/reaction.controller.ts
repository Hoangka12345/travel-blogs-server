import { Body, Controller, Delete, Post, Request, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { AuthGuard } from 'src/guards/verify_token.guard';
import { Request as ExpressRequest } from 'express';

@Controller('reaction')
export class ReactionController {
    constructor(private readonly reactionService: ReactionService) { }

    @UseGuards(AuthGuard)
    @Post()
    createReaction(
        @Body('blogId') blogId: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']

        return this.reactionService.createReaction(_id, blogId)
    }

    @UseGuards(AuthGuard)
    @Delete()
    removeReaction(
        @Body('blogId') blogId: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']

        return this.reactionService.removeReaction(_id, blogId)
    }
}

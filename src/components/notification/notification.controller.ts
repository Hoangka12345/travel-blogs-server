import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/guards/verify_token.guard';
import { NotificationDto } from './dto/notification.dto';
import { Request as ExpressRequest } from 'express'

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @UseGuards(AuthGuard)
    @Get()
    getNotifications(
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']

        return this.notificationService.getNotificationsByUser(_id)
    }

    @UseGuards(AuthGuard)
    @Post()
    createNotification(
        @Body() data: NotificationDto,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']

        return this.notificationService.createNotification(_id, data)
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    removeNotification(
        @Param('id') notificationId: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']

        return this.notificationService.removeNotification(_id, notificationId)
    }
}

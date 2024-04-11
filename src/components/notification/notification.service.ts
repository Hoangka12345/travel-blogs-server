import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { I_Response } from 'src/interfaces/response-data.interface';
import { Notification } from 'src/model/notification.model';
import { NotificationRepository } from 'src/repositories/notification.repository';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepo: NotificationRepository,
    ) { }

    async getNotificationsByUser(userId: string): Promise<I_Response<Notification>> {
        try {
            const notifications = await this.notificationRepo.findAllByCondition({ recipient: userId })
            if (notifications) {
                return {
                    statusCode: HttpStatus.OK,
                    data: notifications
                }
            }
        } catch (error) {
            console.log(">>> error when get notifications: ", error);
            throw new InternalServerErrorException
        }
    }

    async createNotification(sender: string, data: NotificationDto): Promise<Notification> {
        try {

            const notification = await this.notificationRepo.create({ sender, ...data })
            if (notification) {
                return notification
            }
        } catch (error) {
            console.log(">>> error when create noti: ", error);
            throw new InternalServerErrorException
        }
    }

    private async getNotificationInfo(userId: string, notificationId: string): Promise<Notification> {
        try {
            const notification = await this.notificationRepo.findOneByCondition({ recipient: userId, _id: notificationId })
            if (notification) {
                return notification
            } return null
        } catch (error) {
            console.log(">>> getting error when find notification: ", error);
            throw new InternalServerErrorException
        }
    }

    async removeNotification(userId: string, notificationId: string): Promise<I_Response<Comment>> {
        const notificationInfo = await this.getNotificationInfo(userId, notificationId)
        if (!notificationInfo) {
            throw new HttpException("notification này không tồn tại!", HttpStatus.CONFLICT)
        }
        try {
            const notification = await this.notificationRepo.deleteById(notificationId)
            if (notification) {
                return {
                    statusCode: HttpStatus.OK,
                }
            }
        } catch (error) {
            console.log(">>> error when delete noti: ", error);
            throw new InternalServerErrorException
        }
    }
}

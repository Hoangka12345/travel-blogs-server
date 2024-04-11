import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { Notification } from "src/model/notification.model";

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>
    ) {
        super(notificationModel)
    }
}
import { Body, Controller, Get, Param, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from 'src/guards/verify_token.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingDto } from './dto/setting.dto';
import { Request as ExpressRequest } from 'express'

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Get("top-users")
    async getTopContributors() {
        return this.userService.getTopContributors()
    }

    @Get(":id")
    async getUserInfo(
        @Param("id") userId: string
    ) {
        return this.userService.getUserInfo(userId)
    }

    @Get("profile/:id")
    async getProfile(
        @Param("id") userId: string,
        @Query('page') page: number,
    ) {
        return this.userService.getProfile(userId, page)
    }

    @UseGuards(AuthGuard)
    @Get("profile-login/:id")
    async getProfileWhenLogin(
        @Param("id") userId: string,
        @Request() request: ExpressRequest,
        @Query('page') page: number,
    ) {
        const { _id } = request['user']
        return this.userService.getProfileWhenLogin(userId, _id, page)
    }

    @UseGuards(AuthGuard)
    @Put("update-avatar")
    @UseInterceptors(FileInterceptor('avatar'))
    async updateAvatar(
        @Request() request: ExpressRequest,
        @UploadedFile() avatar?: Express.Multer.File
    ) {
        const { _id } = request['user']
        if (avatar.size !== 0) {
            const avatarUpload = await this.cloudinaryService.uploadAvatar(avatar)
            return this.userService.updateUserAvatar(_id, avatarUpload)
        }
    }

    @UseGuards(AuthGuard)
    @Put("update-password")
    @UseInterceptors(FileInterceptor('avatar'))
    async updatePassword(
        @Body() data: SettingDto,
        @Request() request: ExpressRequest,
    ) {
        const { _id } = request['user']
        return this.userService.updateUserPassword(_id, data)

    }
}

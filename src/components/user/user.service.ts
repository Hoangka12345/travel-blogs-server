import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { I_Response } from '../../interfaces/response-data.interface';
import { User } from 'src/model/user.model';
import { SettingDto } from './dto/setting.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from 'src/repositories/user.repository';
import { BlogRepository } from 'src/repositories/blog.repository';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly authService: AuthService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly blogService: BlogService,
    ) { }

    async getUserInfo(userId: string): Promise<I_Response<User>> {
        try {
            const user = await this.userRepo.findOneById(userId)
            if (user) {
                return {
                    statusCode: HttpStatus.OK,
                    data: user
                }
            }
        } catch (error) {
            console.log("err in find user: ", error);
            throw new ConflictException
        }
    }

    async getProfile(userId: string, page: number = 1): Promise<I_Response<any>> {
        const user = await this.getUserInfo(userId)
        if (user.statusCode === 200) {
            // get user's blogs from blog service
            const blogsData = await this.blogService.getBlogsOfUser(userId, page)
            if (blogsData) {
                return {
                    statusCode: HttpStatus.OK,
                    data: { user: user.data, blogs: blogsData?.blogs, pageNumber: blogsData?.pageNumber }
                }
            }
        } return {
            statusCode: HttpStatus.FOUND,
        }
    }

    async getProfileWhenLogin(profileUserId: string, userId: string, page: number = 1): Promise<I_Response<any>> {
        const user = await this.getUserInfo(profileUserId)
        if (user.statusCode === 200) {
            // get user's blogs from blog service
            const blogsData = await this.blogService.getBlogsOfUserWhenLogin(userId, profileUserId, page)

            if (blogsData) {
                return {
                    statusCode: HttpStatus.OK,
                    data: { user: user.data, blogs: blogsData?.blogs, pageNumber: blogsData?.pageNumber }
                }
            }
        } return {
            statusCode: HttpStatus.FOUND,
        }
    }

    async getTopContributors(): Promise<I_Response<User>> {
        try {
            const users = await this.userRepo.getTopContributors()
            if (users[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: users
                }
            } return {
                statusCode: HttpStatus.OK,
                data: []
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException
        }
    }

    async updateUserPassword(userId: string, data: SettingDto): Promise<I_Response<User>> {
        const { oldPassword, newPassword } = data
        const userInfo = await this.getUserInfo(userId)
        if (userInfo.statusCode === 200) {
            const { password } = userInfo.data as User
            const checkPassword = await this.authService.comparePassword(oldPassword, password)

            if (!checkPassword) {
                throw new HttpException("Mật khẩu không đúng!", HttpStatus.CONFLICT)
            }
            const newHashPassword = await this.authService.hashPassword(newPassword)
            if (newHashPassword) {
                try {
                    const user = await this.userRepo.updateById(userId, { password: newHashPassword })
                    if (user) {
                        return {
                            statusCode: HttpStatus.OK,
                            message: "Thay đổi mật khẩu thành công"
                        }
                    } throw new InternalServerErrorException
                } catch (error) {
                    console.log("err in update user's password: ", error);
                    throw new InternalServerErrorException
                }
            }
        }
    }

    async updateUserAvatar(userId: string, newAvatar?: string): Promise<I_Response<string>> {
        if (!newAvatar) {
            throw new HttpException("vui lòng chọn avatar!", HttpStatus.NO_CONTENT)
        }
        const userInfo = await this.getUserInfo(userId)
        if (userInfo.statusCode === 200) {
            const { avatar } = userInfo.data as User
            try {
                const user = await this.userRepo.updateById(userId, { avatar: newAvatar })
                if (user) {
                    await this.cloudinaryService.deleteFile(avatar)
                    return {
                        statusCode: HttpStatus.OK,
                        message: "thay đổi avatar thành công!",
                        data: newAvatar
                    }
                }
            } catch (error) {
                console.log("err in update user's avatar: ", error);
                throw new InternalServerErrorException
            }
        }
    }
}

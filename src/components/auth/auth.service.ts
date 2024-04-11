import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/model/user.model';
import { AuthRepository } from 'src/repositories/auth.repository';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { I_Response } from '../../interfaces/response-data.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepo: AuthRepository,
    ) { }

    private async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await this.authRepo.findOneByCondition({ email });
            if (user) {
                return user
            } return null
        } catch (error) {
            console.log("auth service check email: ", error);
            throw new InternalServerErrorException
        }
    }

    async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        try {
            const checkPassword = await bcrypt.compare(password, hashPassword)
            return checkPassword
        } catch (error) {
            console.error(">>> auth repo: getting error when comparing password!!!", error)
            throw error
        }
    }

    async login(data: LoginDto): Promise<any> {
        const user = await this.findUserByEmail(data.email);
        if (!user) {
            throw new HttpException("Tài khoản không hợp lệ!", HttpStatus.UNAUTHORIZED);
        }

        const checkPassword = await this.comparePassword(data.password, user.password);
        if (!checkPassword) {
            throw new HttpException("Tài khoản không hợp lệ!", HttpStatus.UNAUTHORIZED);
        }

        const { _id } = user;
        const userInfo = { _id };

        const access_token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10m' });
        const refresh_token = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1y' });

        return {
            statusCode: HttpStatus.OK,
            access_token,
            refresh_token,
            user: userInfo
        };
    }

    async hashPassword(pw: string): Promise<string> {
        try {
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hash = await bcrypt.hash(pw, salt)
            return hash
        } catch (error) {
            console.error("getting error when hashing password!!!", error)
            throw error;
        }
    }

    async register(data: RegisterDto, avatar?: string): Promise<I_Response<User>> {
        const user = await this.findUserByEmail(data.email)
        if (user) {
            throw new HttpException("Tài khoản này đã tồn tại!", HttpStatus.CONFLICT)
        }
        try {
            const hashPassword = await this.hashPassword(data.password)
            if (hashPassword) {
                const newUser = await this.authRepo.create({ ...data, password: hashPassword, avatar })
                if (newUser && newUser._id) {
                    return { statusCode: HttpStatus.OK }
                } else {
                    throw new InternalServerErrorException
                }
            }
        } catch (error) {
            console.log(">>> auth-service: getting err when create new user: ", error);
            throw new ConflictException
        }
    }

    async generateNewToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
            if (decoded) {
                const payload = {
                    _id: (decoded as jwt.JwtPayload)._id,
                }
                const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10m' })
                const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1y' })
                return {
                    statusCode: HttpStatus.OK,
                    access_token,
                    refresh_token
                }
            }
        } catch (error) {
            throw new HttpException("token is invalid!", HttpStatus.UNAUTHORIZED)
        }
    }
}

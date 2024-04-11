import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/model/user.model';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthModule } from '../auth/auth.module';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    CloudinaryModule,
    AuthModule,
    BlogModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository]
})
export class UserModule { }

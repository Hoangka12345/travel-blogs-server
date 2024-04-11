import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './components/auth/auth.module';
import { UserModule } from './components/user/user.module';
import { SavedBlogModule } from './components/saved-blog/saved-blog.module';
import { BlogModule } from './components/blog/blog.module';
import { CommentModule } from './components/comment/comment.module';
import { ReactionModule } from './components/reaction/reaction.module';
import { NotificationModule } from './components/notification/notification.module';
import { GatewayModule } from './components/gateway/gateway.module';
import { CloudinaryModule } from './components/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.DB_CONNECTION_STRING
      })
    }),
    AuthModule,
    UserModule,
    SavedBlogModule,
    BlogModule,
    CommentModule,
    ReactionModule,
    NotificationModule,
    GatewayModule,
    CloudinaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

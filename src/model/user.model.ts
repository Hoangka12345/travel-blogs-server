import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop()
    avatar: string;

    @Prop({ default: true })
    active: boolean;

    @Prop({ default: true })
    email: string;

    @Prop({ default: true })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

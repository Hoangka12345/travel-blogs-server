import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Blog extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ required: true })
    address: string;

    @Prop()
    country: string;

    @Prop()
    city: string;

    @Prop()
    content: string;

    @Prop({ default: [] })
    images: string[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PermissionTag } from '../enum/permission-tag.enum';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Role extends Document {
  @Prop({ type: String, required: true, index: true, unique: true })
  public name: string;

  @Prop({
    type: [String],
    enum: PermissionTag,
    default: [],
  })
  public permissions: PermissionTag[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

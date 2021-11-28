import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Module } from '@nestjs/common';
import { Role, RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    UsersModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}

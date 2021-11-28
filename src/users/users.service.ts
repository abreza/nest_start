import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserFindDto } from './dto/user-find.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { UserRo } from './dto/user.ro';
import { UserUpdateDto } from './dto/user-update.dto';
import { UsernameDto } from './dto/username.dto';
import { UsersRo } from './dto/users.ro';
import { plainToClass } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreconditionFailedException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { configService } from 'src/config.service';
import { MailResetPasswordDto } from './dto/mail-reset-password.dto';
import * as crypto from 'crypto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  private readonly mailService: nodemailer.Transporter;

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    this.mailService = nodemailer.createTransport({
      service: 'gmail',
      auth: configService.getGmailAuth(),
    });
  }

  async create(userCreateDto: UserCreateDto): Promise<UserRo> {
    try {
      const { password, ...userData } = userCreateDto;
      const user = await this.userModel.create(userData);
      user.isActive = true;
      await user.setPassword(password);
      return plainToClass(UserRo, await user.save(), {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      console.log(err);
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
        throw new UnprocessableEntityException({
          message: 'Username or Email already exists!',
        });
      }
      throw err;
    }
  }

  async update(userUpdateDto: UserUpdateDto): Promise<void> {
    const { username } = userUpdateDto;
    const user = await this.userModel.findOneAndUpdate(
      { username },
      { $set: userUpdateDto },
    );
    if (!user) {
      throw new NotFoundException();
    }
  }

  async find(userFindDto: UserFindDto): Promise<UsersRo> {
    return {
      users: plainToClass(
        UserRo,
        await this.userModel.find(userFindDto).populate('roles'),
        {
          excludeExtraneousValues: true,
        },
      ),
    };
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username }).populate('roles');
  }

  async suspend(usernameDto: UsernameDto): Promise<void> {
    const user = await this.userModel.findOneAndUpdate(usernameDto, {
      $set: {
        isActive: false,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
  }
  async activate(usernameDto: UsernameDto): Promise<void> {
    const user = await this.userModel.findOneAndUpdate(usernameDto, {
      $set: {
        isActive: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
  }

  async delete(usernameDto: UsernameDto): Promise<void> {
    const user = await this.userModel.deleteOne(usernameDto);
    if (!user) {
      throw new NotFoundException();
    }
  }

  async validate(username: string, password: string): Promise<UserRo> {
    const user = await this.userModel.findOne({ username }).populate('roles');
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.isActive) {
      throw new PreconditionFailedException();
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    return plainToClass(UserRo, user, { excludeExtraneousValues: true });
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: User,
  ): Promise<void> {
    await user.setPassword(changePasswordDto.password);
    await user.save();
  }

  async checkResetPasswordCred(
    resetPassword: ResetPasswordDto,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ email: resetPassword.email });
    if (!user) {
      return false;
    }
    const now = new Date();
    if (
      now < user.resetCodeExpireTime &&
      resetPassword.resetCode === user.resetCode
    ) {
      return true;
    }
    return false;
  }

  async resetPassword(
    resetPassword: ResetPasswordDto,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const valid = await this.checkResetPasswordCred(resetPassword);
    if (valid) {
      const user = await this.userModel.findOne({ email: resetPassword.email });
      this.changePassword(changePasswordDto, user);
      user.resetCodeExpireTime = new Date(0);
      await user.save();
    }
    return;
  }

  async sendResetPasswordMail(
    mailResetPasswordDto: MailResetPasswordDto,
  ): Promise<void> {
    const user = await this.userModel.findOne({
      email: mailResetPasswordDto.email,
    });
    if (!user) {
      return;
    }

    const resetCode = await crypto.randomInt(0, 1000000);
    let date = new Date().getTime();
    date += 3 * 60 * 60 * 1000;
    const resetCodeExpireTime = new Date(date);

    try {
      user.resetCode = resetCode;
      user.resetCodeExpireTime = resetCodeExpireTime;
      user.save();
    } catch (err) {
      console.log(err);
    }

    const mail = {
      from: configService.getGmailAuth().user,
      to: user.email,
      subject: 'Reset Password',
      text: `If you want to reset your password, visit:\n${mailResetPasswordDto.callbackUrl}?email=${user.email}&resetCode=${resetCode}\nLink will expire in 3 hours`,
    };

    try {
      this.mailService.sendMail(mail);
    } catch (err) {
      console.log(err);
    }
  }
}

import {
  UnprocessableEntityException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(user: CreateUserDto) {
    if (user.email != null) {
      const foundUserEmail = await this.userModel.exists({ email: user.email });

      if (foundUserEmail) {
        throw new UnprocessableEntityException('E-mail already registered');
      }
    }
    return this.userModel.create(user);
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id: Types.ObjectId) {
    if (!isValidObjectId(id)) {
      throw new UnprocessableEntityException('Invalid Id');
    }
    if (id) {
      const foundUser = await this.userModel.findById(id);
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }
    }
    return await this.userModel.findById(id).exec();
  }

  async update(id: Types.ObjectId, updateUser: UpdateUserDto) {
    if (updateUser.email != null) {
      const foundUserEmail = await this.userModel.exists({
        email: updateUser.email,
      });

      if (foundUserEmail) {
        throw new UnprocessableEntityException('E-mail already registered');
      }
      if (!isValidObjectId(id)) {
        throw new UnprocessableEntityException('Invalid Id');
      }
    }
    return this.userModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: updateUser,
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async remove(id: Types.ObjectId) {
    if (!isValidObjectId(id)) {
      throw new UnprocessableEntityException('Invalid Id');
    }
    if (isValidObjectId(id)) {
      const foundUser = await this.userModel.findById(id);
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }
    }
    return this.userModel.deleteOne({ _id: id }).exec();
  }
}

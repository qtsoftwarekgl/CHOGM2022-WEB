import { EUserRole } from '@chogm2022/enums';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { environment } from '../../../environments/environment';
import { MailService } from '../../mail/mail.service';
import { RatingInput } from '../../utils/abstract/rating.input';
import { createdBy, localDate } from '../../utils/abstract/utils';
import messages from '../../utils/messages';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entities/user.entity';
import { generateRandomPassword } from '../utils/utils';

@Injectable()
export class UsersService {
  private populate = [
    {
      path: 'rating.rating',
      populate: {
        path: 'user',
        model: 'User',
      },
    },
    {
      path: 'createdBy',
      populate: {
        path: 'user',
        model: 'User',
      },
    },
    {
      path: 'updatedBy',
      populate: {
        path: 'user',
        model: 'User',
      },
    },
  ];
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,
    private readonly mailService: MailService
  ) {}

  async create(createUserInput: CreateUserInput, id: string): Promise<User> {
    const { role } = createUserInput;
    const user = await this.userRepository
      .findOne({ email: createUserInput.email })
      .exec();
    if (user) {
      throw new HttpException(messages.USER_EXIST, HttpStatus.CONFLICT);
    }

    let pwd = createUserInput.password;

    //? for testing purpose
    // ! disabled in prod
    if (pwd === undefined && environment.uat) {
      if (
        // START OF DEPRECATED ROLES
        role[0] === EUserRole.ADMIN ||
        role[0] === EUserRole.HOSPITALITY ||
        role[0] === EUserRole.TRANSPORT ||
        role[0] === EUserRole.COMS ||
        role[0] === EUserRole.COMMAND_POST
      ) {
        pwd = 'Test@123';
      } else {
        pwd = generateRandomPassword(10);
      }
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    this.generateResetUrl(verificationCode, createUserInput);

    createUserInput.password = environment.uat
      ? await bcrypt.hash(pwd, 10)
      : null;
    return new this.userRepository({
      ...createUserInput,
      verificationCode: { code: verificationCode, expiryDate: null },
      createdBy: createdBy(id),
    }).save();
  }

  async update(updateUserInput: UpdateUserInput, id: string): Promise<User> {
    const update = await this.userRepository.findOneAndUpdate(
      { _id: updateUserInput.userId },
      { $push: { updatedBy: createdBy(id) } }
    );

    let verificationCode = 0;
    let query = {};
    const role = updateUserInput?.role ? updateUserInput.role[0] : undefined;
    if (
      role &&
      role !== update.role[0] &&
      role !== EUserRole.SPEAKER &&
      role !== EUserRole.MODERATOR
    ) {
      verificationCode = Math.floor(100000 + Math.random() * 900000);
      query = {
        verificationCode: { code: verificationCode, expiryDate: null },
      };
    }

    const lastUpdate = await this.userRepository
      .findOneAndUpdate(
        { _id: updateUserInput.userId },
        { ...updateUserInput, ...query },
        {
          new: true,
        }
      )
      .populate(this.populate)
      .exec();

    if (verificationCode > 0 && !!query) {
      this.generateResetUrl(verificationCode, lastUpdate);
    }

    return lastUpdate;
  }

  async registerDevice(userId: string, token: string): Promise<User> {
    return await this.userRepository
      .findOneAndUpdate(
        { _id: userId },
        { deviceRegistrationId: token },
        {
          new: true,
        }
      )
      .populate(this.populate)
      .exec();
  }

  async rateUser(id: string, input: RatingInput): Promise<User> {
    try {
      const { rate, user, comment } = input;

      const hasRated = await this.userRepository.findOne({
        'rating.rating.user': new Types.ObjectId(user),
        _id: id,
      });
      if (hasRated?.id) {
        throw new HttpException(messages.ALLREADY_RATED, HttpStatus.CONFLICT);
      }
      const rating = {
        stars: rate,
        user: new Types.ObjectId(user),
        comment,
        createdDate: localDate(new Date()),
      };
      return await this.userRepository
        .findOneAndUpdate(
          { _id: id },
          { $push: { 'rating.rating': rating } },
          { new: true }
        )
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async findAll(skip = 0, limit = 20): Promise<User[]> {
    const users = await this.userRepository
      .find()
      .sort({ lastName: 1 })
      .skip(skip * limit)
      .limit(limit)
      .populate(this.populate)
      .exec();
    return this.sort(users);
  }

  async count(): Promise<number> {
    return await this.userRepository.find().count().exec();
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository
      .findById(id)
      .populate(this.populate)
      .exec();
  }

  async findOneBy(condition: any): Promise<User> {
    return await this.userRepository
      .findOne(condition)
      .populate(this.populate)
      .exec();
  }

  async findAllBy(condition: any): Promise<User[]> {
    const users = await this.userRepository
      .find(condition)
      .populate(this.populate)
      .exec();
    return this.sort(users);
  }

  async findAllByIds(arr: string[]): Promise<User[]> {
    const users = await this.userRepository
      .find({ _id: { $in: arr } })
      .populate(this.populate)
      .exec();
    return this.sort(users);
  }

  async search(searchInput: string): Promise<User[]> {
    const regex = new RegExp(searchInput, 'i');
    const users = await this.userRepository
      .find({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { email: { $regex: regex } },
        ],
      })
      .populate(this.populate)
      .exec();
    return this.sort(users);
  }

  sort(users: User[]): User[] {
    return users?.sort((a, b) =>
      a.lastName
        ?.toLowerCase()
        .replace(/\s/g, '')
        .localeCompare(b.lastName?.toLowerCase().replace(/\s/g, ''))
    );
  }

  generateResetUrl(code: number, { firstName, lastName, email }): void {
    const url = environment.chogm_cms_ui + code;
    this.mailService.accountCreatedSendMail(
      { firstName, lastName, email },
      url
    );
  }
}

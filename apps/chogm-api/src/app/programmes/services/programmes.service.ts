import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ForumsService } from '../../forums/services/forums.service';
import { UsersService } from '../../users/services/users.service';
import { RatingInput } from '../../utils/abstract/rating.input';
import { SpeakerSModerator } from '../../utils/abstract/speakersmodurator.entity';
import { createdBy, localDate } from '../../utils/abstract/utils';
import messages from '../../utils/messages';
import { CreateProgrammeInput } from '../dto/create-programme.input';
import { UpdateProgrammeInput } from '../dto/update-programme.input';
import { Programme } from '../entities/programme.entity';

@Injectable()
export class ProgrammesService {
  private populate = [
    'room',
    'forum',
    'speakers',
    'moderator',
    {
      path: 'room',
      populate: {
        path: 'venue',
        model: 'Venue',
      },
    },
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
    @InjectModel(Programme.name)
    private readonly programmeRepository: Model<Programme>,
    private readonly forumsService: ForumsService,
    private readonly userServices: UsersService
  ) {}

  async create(
    createProgrammeInput: CreateProgrammeInput,
    id: string
  ): Promise<Programme> {
    const programme = await this.programmeRepository
      .findOne({ title: createProgrammeInput.title })
      .exec();

    if (programme) {
      throw new HttpException(messages.PRGRAM_EXIST, HttpStatus.CONFLICT);
    }

    const event = await this.forumsService.findOne(createProgrammeInput.forum);

    if (!event?.id) {
      throw new HttpException(
        messages.EVENT_DOES_NOT_EXIST,
        HttpStatus.CONFLICT
      );
    }

    return (
      await new this.programmeRepository({
        ...createProgrammeInput,
        createdBy: createdBy(id),
      }).save()
    ).populate(this.populate);
  }

  async update(
    updateProgrammeInput: UpdateProgrammeInput,
    id: string
  ): Promise<Programme> {
    const update = await this.programmeRepository
      .findOneAndUpdate(
        { _id: updateProgrammeInput.programmeId },
        { ...updateProgrammeInput },
        { new: true }
      )
      .populate(this.populate)
      .exec();
    await this.programmeRepository.findOneAndUpdate(
      { _id: updateProgrammeInput.programmeId },
      { $push: { updatedBy: createdBy(id) } }
    );
    return update;
  }

  async findAll(condition = {}): Promise<Programme[]> {
    try {
      return await this.programmeRepository
        .find(condition)
        .sort({ startDate: -1 })
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async findOne(id: string, condition = {}): Promise<Programme> {
    return await this.programmeRepository
      .findOne({ ...{ _id: id }, ...condition })
      .populate(this.populate)
      .exec();
  }

  async findBy(condition: any): Promise<Programme[]> {
    return await this.programmeRepository
      .find(condition)
      .populate(this.populate)
      .exec();
  }

  async rateProgramme(id: string, input: RatingInput): Promise<Programme> {
    try {
      const { rate, user, comment } = input;

      const hasRated = await this.programmeRepository.findOne({
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
      return await this.programmeRepository
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

  async findSpeakersBy(condition: any): Promise<SpeakerSModerator> {
    try {
      const speakers: string[] = [];
      const moderators: string[] = [];
      const programmes = await this.programmeRepository.find(condition).exec();
      if (programmes?.length > 0) {
        programmes.forEach(async (pro) => {
          pro.speakers.forEach((u) => {
            speakers.push(u);
          });
          pro.moderator.forEach((u) => {
            moderators.push(u);
          });
        });
        return {
          speakers: await this.userServices.findAllByIds(speakers),
          moderators: await this.userServices.findAllByIds(moderators),
        };
      } else {
        return {
          speakers: [],
          moderators: [],
        };
      }
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }
}

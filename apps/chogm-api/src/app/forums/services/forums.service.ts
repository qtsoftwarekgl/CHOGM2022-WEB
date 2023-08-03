import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RatingInput } from '../../utils/abstract/rating.input';
import { createdBy, localDate } from '../../utils/abstract/utils';
import messages from '../../utils/messages';
import { Venue } from '../../venues/entities/venue.entity';
import { VenuesService } from '../../venues/services/venues.service';
import { CreateForumInput } from '../dto/create-forum.input';
import { UpdateForumInput } from '../dto/update-forum.input';
import { Forum } from '../entities/forum.entity';

@Injectable()
export class ForumsService {
  private populate = [
    'venue',
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
    @InjectModel(Forum.name)
    private readonly forumRepository: Model<Forum>,
    private readonly venueService: VenuesService
  ) {}
  async create(createforumInput: CreateForumInput, id: string): Promise<Forum> {
    const forum = await this.forumRepository.findOne({
      name: createforumInput.name,
    });
    if (forum?.name) {
      throw new HttpException(messages.EVENT_EXIST, HttpStatus.CONFLICT);
    }
    const venue = await this.checkVenue(createforumInput.venue);
    if (!venue) return;
    return (
      await new this.forumRepository({
        ...createforumInput,
        createdBy: createdBy(id),
      }).save()
    ).populate(this.populate);
  }

  async update(updateForumInput: UpdateForumInput, id: string): Promise<Forum> {
    const update = await this.forumRepository
      .findOneAndUpdate({ _id: updateForumInput.forumId }, updateForumInput, {
        new: true,
      })
      .populate(this.populate)
      .exec();

    await this.forumRepository.findOneAndUpdate(
      { _id: updateForumInput.forumId },
      {
        $push: { updatedBy: createdBy(id) },
      }
    );

    return update;
  }

  findAll(condition: any = {}): Promise<Forum[]> {
    return this.forumRepository
      .find(condition)
      .sort({ 'createdBy.date': -1 })
      .populate(this.populate)
      .exec();
  }

  findOne(id: string, condition: any = {}): Promise<Forum> {
    return this.forumRepository
      .findById({ _id: id, ...condition })
      .populate(this.populate)
      .exec();
  }

  findAllBy(condition: any): Promise<Forum[]> {
    return this.forumRepository
      .find(condition)
      .sort({ 'createdBy.date': -1 })
      .populate(this.populate)
      .exec();
  }

  async checkVenue(venueId: string): Promise<Venue> {
    const venue = await this.venueService.findOne(venueId);
    if (!venue) {
      throw new HttpException(messages.VENUE_NOT_EXIST, HttpStatus.NOT_FOUND);
    }
    return venue;
  }

  async registerToAttend(userId: string, forumId: string): Promise<Forum> {
    try {
      const registered = await this.forumRepository
        .findOne({ id: forumId, attendees: userId })
        .exec();
      if (registered?.id) {
        throw new HttpException(
          messages.ALLREADY_REGISTERED,
          HttpStatus.CONFLICT
        );
      }
      return await this.forumRepository
        .findOneAndUpdate(
          { id: forumId },
          { $push: { attendees: userId } },
          { new: true }
        )
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async rateForum(id: string, input: RatingInput): Promise<Forum> {
    try {
      const { rate, user, comment } = input;

      const hasRated = await this.forumRepository.findOne({
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
      return await this.forumRepository
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
}

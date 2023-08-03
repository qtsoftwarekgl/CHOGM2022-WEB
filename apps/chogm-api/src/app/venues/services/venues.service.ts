import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RatingInput } from '../../utils/abstract/rating.input';
import { createdBy, localDate } from '../../utils/abstract/utils';
import messages from '../../utils/messages';
import { CreateVenueInput } from '../dto/create-venue.input';
import { UpdateVenueInput } from '../dto/update-venue.input';
import { VenueCategoryInput } from '../dto/venue-category.input';
import { Venue } from '../entities/venue.entity';

@Injectable()
export class VenuesService {
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
    @InjectModel(Venue.name)
    private readonly venueRepository: Model<Venue>
  ) {}

  async create(createVenueInput: CreateVenueInput, id: string): Promise<Venue> {
    const venue = await this.venueRepository.findOne({
      name: createVenueInput.name,
      venueCategory: createVenueInput.venueCategory,
    });
    if (venue?.name) {
      throw new HttpException(messages.VENU_EXIST, HttpStatus.CONFLICT);
    }
    return new this.venueRepository({
      ...createVenueInput,
      createdBy: createdBy(id),
    }).save();
  }

  async update(updateVenueInput: UpdateVenueInput, id: string): Promise<Venue> {
    const update = await this.venueRepository
      .findOneAndUpdate({ _id: updateVenueInput.venueId }, updateVenueInput, {
        new: true,
      })
      .populate(this.populate)
      .exec();

    await this.venueRepository.findOneAndUpdate(
      { _id: updateVenueInput.venueId },
      { $push: { updatedBy: createdBy(id) } }
    );

    return update;
  }

  async rateVenue(id: string, input: RatingInput): Promise<Venue> {
    try {
      const { rate, user, comment } = input;

      const hasRated = await this.venueRepository.findOne({
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
      return await this.venueRepository
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

  async findAll(condition: any = {}): Promise<Venue[]> {
    return await this.venueRepository
      .find(condition)
      .sort({ 'createdBy.date': -1 })
      .populate(this.populate)
      .exec();
  }

  async findAvailableRanking(
    venuCategoryInput: VenueCategoryInput
  ): Promise<number[]> {
    const takenHotelvenues = await this.venueRepository
      .find({
        venueCategory: venuCategoryInput.category,
        'venueInfo.hotelRanking': { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      })
      .exec();

    return takenHotelvenues?.map(({ venueInfo }) => venueInfo.hotelRanking);
  }

  async findOne(id: string, condition: any = {}): Promise<Venue> {
    return await this.venueRepository
      .findOne({ ...{ _id: id }, ...condition })
      .populate(this.populate)
      .exec();
  }

  async findAllBy(condition: any): Promise<Venue[]> {
    const venues = await this.venueRepository
      .find(condition)
      .sort({ 'venueInfo.hotelRanking': 1 })
      .populate(this.populate)
      .exec();
    return venues.sort(
      (a, b) => a?.venueInfo?.hotelRanking - b?.venueInfo?.hotelRanking
    );
  }
}

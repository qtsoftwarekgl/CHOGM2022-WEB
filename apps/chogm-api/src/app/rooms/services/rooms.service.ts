import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createdBy } from '../../utils/abstract/utils';
import messages from '../../utils/messages';
import { Venue } from '../../venues/entities/venue.entity';
import { VenuesService } from '../../venues/services/venues.service';
import { CreateRoomInput } from '../dto/create-room.input';
import { UpdateRoomInput } from '../dto/update-room.input';
import { Room } from '../entities/room.entity';

@Injectable()
export class RoomsService {
  private populate = [
    'venue',
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
    @InjectModel(Room.name)
    private readonly roomRepository: Model<Room>,
    private readonly venueService: VenuesService
  ) {}

  async create(createRoomInput: CreateRoomInput, id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      name: createRoomInput.name,
    });
    if (room?.name) {
      throw new HttpException(messages.ROOM_EXIST, HttpStatus.CONFLICT);
    }
    const venue = await this.checkVenue(createRoomInput.venue);
    if (!venue) return;
    return new this.roomRepository({
      ...createRoomInput,
      createdBy: createdBy(id),
    }).save();
  }

  async updateRoom(
    updateRoomInput: UpdateRoomInput,
    id: string
  ): Promise<Room> {
    const update = await this.roomRepository
      .findOneAndUpdate({ _id: updateRoomInput.roomId }, updateRoomInput, {
        new: true,
      })
      .populate(this.populate)
      .exec();

    await this.roomRepository.findOneAndUpdate(
      { _id: updateRoomInput.roomId },
      {
        $push: { updatedBy: createdBy(id) },
      }
    );

    return update;
  }

  async findAll(): Promise<Room[]> {
    const rooms = await this.roomRepository
      .find()
      .populate(this.populate)
      .exec();
    return this.sort(rooms);
  }

  async findOne(id: string): Promise<Room> {
    return await this.roomRepository
      .findOne({ _id: id })
      .populate(this.populate)
      .exec();
  }

  async findBy(condition: any): Promise<Room[]> {
    try {
      const rooms = await this.roomRepository
        .find(condition)
        .populate(this.populate)
        .exec();
      return this.sort(rooms);
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async checkVenue(venueId: string): Promise<Venue> {
    const venue = await this.venueService.findOne(venueId);
    if (!venue) {
      throw new HttpException(messages.VENUE_NOT_EXIST, HttpStatus.NOT_FOUND);
    }
    return venue;
  }

  async update(condition: any, payload: any) {
    return this.roomRepository.updateOne(condition, payload);
  }

  sort(rooms: Room[]): Room[] {
    return rooms?.sort((a, b) =>
      a.name
        ?.toLowerCase()
        .replace(/\s/g, '')
        .localeCompare(b.name.toLowerCase().replace(/\s/g, ''))
    );
  }
}

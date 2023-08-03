import { ECMSTypes } from '@chogm2022/enums';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { createdBy } from '../../utils/abstract/utils';
import messages from '../../utils/messages';
import { AllStats } from '../dto/cms-stat';
import { CreateCmsInput } from '../dto/create-cms.input';
import { UpdateCmsInput } from '../dto/update-cms.input';
import { Cms } from '../entities/cms.entity';

@Injectable()
export class CmsService {
  statsUrl = environment.chogm_cms_api_url + '/statistics&event_id=';
  private populate = [
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
    @InjectModel(Cms.name)
    private readonly cmsRepository: Model<Cms>,
    private httpService: HttpService
  ) {}

  async create(createCmsInput: CreateCmsInput, id: string): Promise<Cms> {
    let query = {};
    let hasOneRecord = false;
    switch (createCmsInput.category) {
      case ECMSTypes.ABOUT_CONFERENCE:
      case ECMSTypes.COMSEC:
      case ECMSTypes.TRANSIT_VISA:
      case ECMSTypes.VISA_ON_ARRIVAL:
      case ECMSTypes.VISITORS_VISA:
			case ECMSTypes.PRIVACY_POLICY:
			case ECMSTypes.TOLL_NUMBER:
        query = { category: createCmsInput.category };
        hasOneRecord = true;
        break;
      default:
        query = {
          name: createCmsInput.name,
          category: createCmsInput.category,
        };
        hasOneRecord = false;
        break;
    }

    const cms = await this.cmsRepository.findOne(query).exec();
    if (!hasOneRecord) {
      if (cms?.id) {
        throw new HttpException(messages.CONTENT_EXIST, HttpStatus.CONFLICT);
      }
      return await new this.cmsRepository({
        ...createCmsInput,
        createdBy: createdBy(id),
      }).save();
    } else {
      if (cms?.id) {
        const updated = await this.cmsRepository.updateOne(
          { id: cms?.id },
          {
            name: createCmsInput.name,
            description: createCmsInput.description,
          }
        );
        if (updated) {
          return await this.cmsRepository.findOne(query);
        }
      } else {
        return await new this.cmsRepository({
          ...createCmsInput,
          createdBy: createdBy(id),
        }).save();
      }
    }
  }

  async update(updateCmsInput: UpdateCmsInput, id: string): Promise<Cms> {
    const update = await this.cmsRepository
      .findOneAndUpdate({ _id: updateCmsInput.cmsId }, updateCmsInput)
      .exec();

    await this.cmsRepository
      .findOneAndUpdate(
        { _id: updateCmsInput.cmsId },
        { $push: { updatedBy: createdBy(id) } }
      )
      .populate(this.populate)
      .exec();

    return update;
  }

  findAll(condition = {}): Promise<Cms[]> {
    return this.cmsRepository
      .find(condition)
      .sort({ 'createdBy.date': -1 })
      .populate(this.populate)
      .exec();
  }

  findOne(id: string, condition = {}): Promise<Cms> {
    return this.cmsRepository
      .findOne({ _id: id, ...condition })
      .populate(this.populate)
      .exec();
  }

  findBy(condition: any): Promise<Cms[]> {
    return this.cmsRepository.find(condition).populate(this.populate).exec();
  }

  findNews(): Promise<Cms[]> {
    try {
      return this.cmsRepository
        .find({ category: ECMSTypes.NEWS, state: true })
        .sort({ 'createdBy.date': -1 })
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  findByCategory(category: ECMSTypes): Promise<Cms> {
    try {
      return this.cmsRepository
        .findOne({ category: category, state: true })
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async getStats(): Promise<AllStats> {
    const businessUrl = this.statsUrl + '3232';
    const youthUrl = this.statsUrl + '1559';
    const peopleUrl = this.statsUrl + '2127';
    const mediaUrl = this.statsUrl + '4326';
    const womenUrl = this.statsUrl + '1463';
    const chogmUrl = this.statsUrl + '8064';

    // get business forum data
    const { data: business } = await firstValueFrom(
      this.httpService.get(businessUrl)
    );

    // get youth forum data
    const { data: youth } = await firstValueFrom(
      this.httpService.get(youthUrl)
    );

    // get media forum data
    const { data: media } = await firstValueFrom(
      this.httpService.get(mediaUrl)
    );

    // get people forum data
    const { data: people } = await firstValueFrom(
      this.httpService.get(peopleUrl)
    );

    // get women forum data
    const { data: women } = await firstValueFrom(
      this.httpService.get(womenUrl)
    );

    // get women forum data
    const { data: chogm } = await firstValueFrom(
      this.httpService.get(chogmUrl)
    );

    if (
      business?.status === 200 &&
      youth?.status === 200 &&
      media?.status === 200 &&
      people?.status === 200 &&
      women?.status === 200 &&
      chogm?.status === 200
    ) {
      return {
        women: women.data,
        people: people.data,
        media: media.data,
        youth: youth.data,
        chogm: youth.data,
        business: youth.data,
      };
    } else {
      throw new HttpException(
        'Error fetching CHOGM stats data',
        HttpStatus.CONFLICT
      );
    }
  }
}

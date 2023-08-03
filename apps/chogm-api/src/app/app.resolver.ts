import { HttpException, HttpStatus } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { createWriteStream } from 'fs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import messages from './utils/messages';
import path = require('path');

@Resolver()
export class AppResolver {
  constructor() {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename, mimetype }: FileUpload
  ): Promise<string> {
    if (mimetype?.split('/')[0] !== 'image') {
      throw new HttpException(
        messages.NOT_IMAGE_TYPE,
        HttpStatus.EXPECTATION_FAILED
      );
    }
    const file = this.getFileName(filename);
    return new Promise((resolve, reject) =>
      createReadStream()
        .pipe(
          createWriteStream(path.resolve(`./uploads/${file}`), {
            flags: 'a+',
          })
        )
        .on('finish', () => resolve(file))
        .on('error', (err) => reject(err))
    );
  }

  @Mutation(() => String)
  async uploadPDFFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename, mimetype }: FileUpload
  ): Promise<string> {
    if (mimetype?.split('/')[1] !== 'pdf') {
      throw new HttpException(
        messages.NOT_PDF_TYPE,
        HttpStatus.EXPECTATION_FAILED
      );
    }
    const file = this.getFileName(filename);
    return new Promise((resolve, reject) =>
      createReadStream()
        .pipe(
          createWriteStream(path.resolve(`./uploads/${file}`), {
            flags: 'a+',
          })
        )
        .on('finish', () => resolve(file))
        .on('error', (err) => reject(err))
    );
  }

  getFileName(fileName: string): string {
    const date = new Date();
    return (
      date.getFullYear() +
      '_' +
      date.getMonth() +
      '_' +
      date.getDate() +
      '_' +
      date.getMilliseconds() +
      '_' +
      fileName
    );
  }
}

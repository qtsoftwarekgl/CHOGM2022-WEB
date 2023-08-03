import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { environment } from '../../../environments/environment';

export const ThumbnailMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn
) => {
  const value = await next();
  const condition = value?.includes('https://api.chogm2022.rw');
  return condition
    ? value
    : value && !condition
    ? environment.host + value
    : '';
};

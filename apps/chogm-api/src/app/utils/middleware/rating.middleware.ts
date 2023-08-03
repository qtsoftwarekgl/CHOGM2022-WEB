import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const RatingMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn
) => {
  const { rating } = await next();
  return {
    rate:
      rating && rating.length > 0
        ? rating.reduce((acc: any, obj: any) => {
            return acc + obj?.stars;
          }, 0) / rating.length
        : 0,
    rating,
  };
};

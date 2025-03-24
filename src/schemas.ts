import { z } from 'zod';

export const InstagramPostSchema = z.object({
  date: z.string(),
  likes: z.number(),
  comments: z.number(),
  caption: z.string(),
  url: z.string(),
  location: z.string().nullable(),
});

export const InstagramUserDataSchema = z.object({
  username: z.string(),
  full_name: z.string(),
  biography: z.string(),
  followers: z.number(),
  following: z.number(),
  post_count: z.number(),
  posts: z.array(InstagramPostSchema),
});

export const InstagramDataSchema = z.object({
  status: z.string(),
  data: z.array(InstagramUserDataSchema),
  error: z.string().nullable(),
});

export const PriceAmountSchema = z.object({
  currencyCode: z.string(),
  units: z.string(),
});

export const PriceRangeObjectSchema = z.object({
  startPrice: PriceAmountSchema.optional(),
  endPrice: PriceAmountSchema.optional(),
});

export const DisplayNameSchema = z.object({
  text: z.string(),
  languageCode: z.string(),
});

export const RestaurantSchema = z.object({
  id: z.string(),
  types: z.array(z.string()),
  nationalPhoneNumber: z.string().optional(),
  formattedAddress: z.string(),
  rating: z.number().optional(),
  instagramURL: z.string(),
  businessStatus: z.string(),
  priceLevel: z.string().optional(),
  userRatingCount: z.number().optional(),
  displayName: DisplayNameSchema,
  primaryTypeDisplayName: DisplayNameSchema,
  delivery: z.string().optional(),
  priceRange: z.union([z.string(), PriceRangeObjectSchema]).optional(),
  processedInstagramUrl: z.string().optional(),
});

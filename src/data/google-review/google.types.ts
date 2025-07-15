import { localizaionData } from "./localization";

export interface IImage {
  url: string;
  thumbnailUrl: string;
}

export interface IReview {
  id: string;
  authorName: string;
  authorUrl: string;
  profilePhotoUrl: string;
  rating: number;
  relativeTimeDescription: string;
  text: string;
  images?: IImage[];
  hide: boolean;
  hashId: number;
}

export interface ISummary {
  items: string[];
  updated: string;
  placeHash: number;
}

export interface IBusiness {
  placeId: string;
  name: string;
  address: string;
  reviewsNumber: number;
  rating: number;
  icon: string;
  imageUrl: string;
  url: string;
  writeReviewUrl: string;
  phoneNumber: string;
  openHours: object;
  reviews: IReview[];
  summary?: ISummary;
}

export interface ILocalization {
  google_rating: string;
  show_more: string;
  show_less: string;
  review: string;
  reviews: string;
  verified: string;
  star_rating: string;
  by: string;
  write_review: string;
  load_more: string;
  based_on: string;
  ai_summary: string;
  be_first_review: string;
  work_time: string;
  day_off: string;
  always_on: string;
  closed: string;
  open: string;
  see_all: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface IGoogleHomeData {
  language: keyof typeof localizaionData;
  business: IBusiness[];
  widgets: unknown[];
  localization: ILocalization;
  customCSS: string;
  verified: boolean;
  updatedTime: number;
}

export interface IGenerateReviewOptions {
  text?: boolean;
  images?: number;
  rating?: number;
}

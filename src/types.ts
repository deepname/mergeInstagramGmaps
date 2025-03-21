interface PriceAmount {
  currencyCode: string;
  units: string;
}

interface PriceRange {
  startPrice?: PriceAmount;
  endPrice?: PriceAmount;
}

interface DisplayName {
  text: string;
  languageCode: string;
}

export interface Restaurant {
  id: string;
  types: string[];
  nationalPhoneNumber?: string;
  formattedAddress: string;
  rating?: number;
  websiteUri?: string;
  instagramURL: string;
  businessStatus: string;
  priceLevel?: string;
  userRatingCount?: number;
  displayName: DisplayName;
  primaryTypeDisplayName: DisplayName;
  delivery?: string;
  priceRange?: PriceRange;
  processedInstagramUrl?: string;
}

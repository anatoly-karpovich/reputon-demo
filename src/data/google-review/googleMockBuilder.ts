import { faker } from "@faker-js/faker";
import { IBusiness, IGenerateReviewOptions, IGoogleHomeData, IReview } from "./google.types";
import { arboforMock, mcDonaldsMock } from "./home.mock";
import { localizaionData } from "./localization";
import { getRandomKey } from "utils/object/getRandomKey";

export class GoogleMockBuilder {
  private data: IGoogleHomeData = {
    widgets: [],
    customCSS: "",
    verified: true,
    updatedTime: Date.now(),
    business: [],
    language: "en",
    localization: localizaionData.en,
  };

  private savedBusinesses: Record<"arbofor" | "mcDonalds", IBusiness> = {
    arbofor: structuredClone(arboforMock),
    mcDonalds: structuredClone(mcDonaldsMock),
  };

  /**
   * Constructor for GoogleMockBuilder.
   * If no language is provided, a random language is selected.
   * @param language - Optional language key from the localization data.
   */
  constructor(language?: keyof typeof localizaionData) {
    this.setLanguage(language);
  }

  /**
   * Sets the language and corresponding localization data.
   * If no language is provided, a random language is selected.
   *
   * @param language - Optional language key from the localization data.
   * @returns The current instance of GoogleMockBuilder for method chaining.
   */
  setLanguage(language?: keyof typeof localizaionData) {
    if (!language) {
      language = getRandomKey(localizaionData);
    }
    this.data.language = language;
    this.data.localization = localizaionData[language];
    return this;
  }

  /**
   * Sets the language and corresponding localization data, excluding the given language.
   * If the given language does not exist in the localization data, it throws an error.
   *
   * @param exceptedLanguage - The language to exclude.
   * @returns The current instance of GoogleMockBuilder for method chaining.
   */
  setLanguageExcept(exceptedLanguage: keyof typeof localizaionData) {
    const language = getRandomKey(localizaionData, exceptedLanguage);
    this.data.language = language;
    this.data.localization = localizaionData[language];
    return this;
  }

  /**
   * Adds a random business to the data.business array.
   * @returns The current instance of GoogleMockBuilder for method chaining.
   */
  addRandomBusiness() {
    const randomBusiness: IBusiness = {
      placeId: faker.string.uuid(),
      name: faker.company.name(),
      address: faker.address.streetAddress(),
      reviewsNumber: 0,
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      icon: faker.image.avatar(),
      imageUrl: faker.image.url(),
      url: faker.internet.url(),
      writeReviewUrl: faker.internet.url(),
      phoneNumber: faker.phone.number(),
      openHours: this.generateDefaultOpenHours(),
      reviews: [],
    };

    this.data.business.push(randomBusiness);
    return this;
  }

  /**
   * Adds a saved business to the list of businesses
   * @param key the key of the saved business to add (default "arbofor")
   * @returns The current instance of GoogleMockBuilder for method chaining.
   */
  addSavedBusiness(key?: keyof typeof this.savedBusinesses) {
    const savedBusiness = key ? this.savedBusinesses[key] : this.savedBusinesses["arbofor"];
    if (!savedBusiness) {
      throw new Error(`[Google Mock Builder Error] Saved business "${key}" not found.`);
    }

    this.data.business.push(savedBusiness);
    return this;
  }

  /**
   * Set the number of reviews for a business
   * @param amount the number of reviews to set
   * @param index the index of the business in the business array (default 0)
   * @param options the options to generate the review with (default { text: true, images: 1, rating: 5 })
   * @returns The current instance of GoogleMockBuilder for method chaining.
   */
  setReviewsCount(
    amount: number,
    index = 0,
    options: Partial<IGenerateReviewOptions> = {
      text: true,
      images: 1,
      rating: 5,
    },
  ) {
    const business = this.getBusinessByIndex(index);
    business.reviews = [];
    business.reviewsNumber = amount;

    for (let i = 0; i < amount; i++) {
      business.reviews.push(this.generateReview(options));
    }

    return this;
  }

  /**
   * Adds a single review to a specified business.
   * @param index - The index of the business in the business array (default is 0).
   * @param options - The options to generate the review with, which include text, images, and rating
   *                  (default is { text: true, images: 1, rating: 5 }).
   * @returns The current instance of GoogleMockBuilder for method chaining.
   */
  addReview(
    index = 0,
    options: Partial<IGenerateReviewOptions> = {
      text: true,
      images: 1,
      rating: 5,
    },
  ) {
    const business = this.getBusinessByIndex(index);
    business.reviewsNumber++;
    business.reviews.push(this.generateReview(options));
    return this;
  }

  /**
   * Sets an AI-generated summary for a specified business.
   *
   * @param index - The index of the business in the business array (default is 0).
   * @param items - An optional array of summary items. If not provided, three random sentences will be generated.
   * @returns The current instance of GoogleMockBuilder for method chaining.
   */
  setAISummary(index = 0, items?: string[]) {
    const business = this.getBusinessByIndex(index);
    business.summary = {
      items: items ?? Array.from({ length: 3 }, () => faker.lorem.sentence()),
      updated: new Date().toISOString(),
      placeHash: -506899762, //faker.number.int(),
    };

    return this;
  }

  /**
   * Sets the number of reviews for a specified business to 0.
   * @param index - The index of the business in the business array (default is 0).
   * @returns The current instance of GoogleMockBuilder for method chaining.
   */
  setNoReviews(index = 0) {
    const business = this.getBusinessByIndex(index);
    business.reviews = [];
    business.reviewsNumber = 0;
    return this;
  }

  /**
   * Sets the "verified" property of the mock data.
   * @param verified - True if the business is verified, false otherwise.
   * @returns The current instance of GoogleMockBuilder for method chaining.
   */
  setVerified(verified: boolean) {
    this.data.verified = verified;
    return this;
  }

  /**
   * Retrieves the localized text of a given key from the current locale.
   * @param key - The key of the localized text to retrieve.
   * @returns The localized text associated with the given key.
   */
  getLocalization(key: keyof (typeof localizaionData)["en"]) {
    return this.data.localization[key];
  }

  /**
   * Constructs and returns the mock Google Home data.
   * @returns The constructed IGoogleHomeData object containing widgets, custom CSS, verification status,
   * updated time, business details, language, and localization information.
   */

  build() {
    return this.data;
  }

  private generateReview(options: Partial<IGenerateReviewOptions>) {
    const review: IReview = {
      id: faker.string.uuid(),
      authorName: faker.person.firstName(),
      authorUrl: faker.internet.url(),
      profilePhotoUrl: faker.image.avatar(),
      rating: options.rating ?? faker.number.int({ min: 1, max: 5 }),
      relativeTimeDescription: "3 дня назад",
      text: options.text ? faker.lorem.paragraph({ min: 5, max: 10 }) : "",
      hide: false,
      hashId: faker.number.int(),
    };

    if (options.images) {
      review.images = Array.from({ length: options.images }, () => {
        const url = faker.image.url();
        return {
          url,
          thumbnailUrl: url,
        };
      });
    }

    return review;
  }

  private generateDefaultOpenHours(): Record<string, unknown> {
    return {
      "1": { intervals: [{ start: "07:00", end: "01:00" }] },
      "2": { intervals: [{ start: "07:00", end: "01:00" }] },
      "3": { intervals: [{ start: "07:00", end: "01:00" }] },
      "4": { intervals: [{ start: "07:00", end: "01:00" }] },
      "5": { intervals: [{ start: "07:00", end: "00:00" }] },
      "6": { open24h: true },
      "7": { open24h: true },
    };
  }

  private getBusinessByIndex(index: number) {
    const business = this.data.business[index];
    if (!business) {
      throw new Error(`[Google Mock Builder Error] No business found at index ${index}`);
    }
    return business;
  }
}

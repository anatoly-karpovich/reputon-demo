import { GOOGLE_DEMO_SHOP_API_URL } from "config/env";
import { STATUS_CODES } from "data/api/statusCodes";
import { IGoogleHomeData } from "data/google-review/google.types";
import { Mock } from "data/mock/mock";

export class GooglePagesMock extends Mock {
  public async demoShop(mock: IGoogleHomeData, status: STATUS_CODES = STATUS_CODES.OK) {
    await this.modifyReponse(GOOGLE_DEMO_SHOP_API_URL, mock, status);
  }
}

import { Service } from "typedi";
import { DistrictRepository } from "../repositories/DistrictRepository";

@Service()
export class TestService {
  /**
   * 테스트를 위한 Function
   *
   */
  constructor(private readonly districtRepository: typeof DistrictRepository) {
    this.districtRepository = DistrictRepository;
  }
  public async testFunction() {
    const result = await this.districtRepository.getAddressByPoint(
      "POINT(128.6240551 36.8056858)"
    );
    return result.city;
  }
}

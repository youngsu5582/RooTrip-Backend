import { GenderType } from "../common";
import { ProfileDto } from "../dtos/ProfileDto";
import Profile from "../entities/Profile";
import database from "../loaders/database";

export const ProfileRepository = database.getRepository(Profile).extend({

  async getByUserId(userId:string){
    return await this.findOne({ where: {userId} });
  },  
  async uploadProfileImage(userId: string, profileDto: ProfileDto) {
    const profile = await this.createQueryBuilder()
    .where("user_id = :user_id", { user_id: userId })
    .getOne();

  if (profile) {
    profile.profileImage = profileDto.profileImage;
    profile.tagLine = profileDto.tagLine;
    await this.save(profile);
  }
  return profile;
  },
  async getProfileImageByUserId(userId:string){
    return await this.findOne({where:{userId},select:["profileImage"]}).then(profile=>profile.profileImage);
  },
  async updateNickname(userId: string, nickname: string) {
    const profile = await this.createQueryBuilder()
    .where("user_id = :user_id", { user_id: userId })
    .getOne();

    if (profile) {
      profile.nickname = nickname;
      await this.save(profile);

      
    }
    return profile;
  },
  async updateGender(userId: string, gender: GenderType) {
    const profile = await this.createQueryBuilder()
    .where("user_id = :user_id", { user_id: userId })
    .getOne();

    if (profile) {
      profile.gender = gender;
      await this.save(profile);
    }
    return profile;
  },
})
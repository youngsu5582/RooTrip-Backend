import { User } from "../entities";
import database from "../loaders/database";

export const UserRepository = database.getRepository(User).extend({
  async getById(id: string) {
    return await this.findOne({ where: { id } });
  },
  async getByEmail(email: string) {
    return await this.findOne({ where: { email } });
  },
  async deleteRefreshTokenById(id: string) {
    return await this.update(id, { refreshToken: undefined });
  },
  async updateNickname(id: string, nickname: string) {
    return await this.update(id, {nickname: nickname});
  },
  async withdrawal(id: string) {
    return await this.delete(id);
  }
});

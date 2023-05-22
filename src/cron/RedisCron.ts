import { CronJob } from "cron";
import { LessThan } from "typeorm";
import { PostRepository } from "../repositories";
import { logger } from "../utils/Logger";
import { deletePostViews, deletePostSets } from "../utils/Redis";
const expire = 24 * 60 * 60 * 1000;
export default new CronJob(
  "* 2 * * *",
  async () => {
    await deletePostSets();
    const expiredTime = new Date(Date.now() - expire);
    const posts = await PostRepository.find({
        where: { deletedAt: LessThan(expiredTime) }
      });
    if (posts) {
      try {
        posts.forEach(post=>deletePostViews(post.id));
      } catch (err) {
        logger.error(err);
      }
    }
  },
  null,
  false,
  "Asia/Seoul"
);

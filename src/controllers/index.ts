import { AuthController } from "./AuthController";
import { PostController } from "./PostController";
import { TestController } from "./TestController";
import { PhotoController } from "./PhotoController";
import { EmailController } from "./EmailController";
export class Controllers {
  constructor() {}
  get default() {
    return {
      AuthController,
      PostController,
      TestController,
      PhotoController,
      EmailController
    };
  }
}

export { AuthController, PostController, TestController, PhotoController };

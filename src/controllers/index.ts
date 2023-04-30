import { AuthController } from "./AuthController";
import { PostController } from "./PostController";
import { TestController } from "./TestController";
import { PhotoController } from "./PhotoController";
import { EmailController } from "./EmailController";
import { MachineController } from "./MachineController";
export class Controllers {
  constructor() {}
  get default() {
    return {
      AuthController,
      PostController,
      TestController,
      PhotoController,
      EmailController,
      MachineController,
    };
  }
}

export { AuthController, PostController, TestController, PhotoController ,MachineController};

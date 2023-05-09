import { AuthController } from "./AuthController";
import { PostController } from "./PostController";
import { TestDataController } from "./TestController";
import { PhotoController } from "./PhotoController";
import { EmailController } from "./EmailController";
import { MachineController } from "./MachineController";
export class Controllers {
  constructor() {}
  get default() {
    return {
      AuthController,
      PostController,
      TestDataController,
      PhotoController,
      EmailController,
      MachineController,
    };
  }
}

export { AuthController, PostController, TestDataController, PhotoController ,MachineController};

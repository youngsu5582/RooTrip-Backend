import {
  Body,
  BodyParam,
  HttpCode,
  JsonController,
  Post
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import { EmailVerifyDto } from "../dtos/AuthDto";
import { AuthService } from "../services";
import { EmailService } from "../services/EmailService";
import { UUID } from "../utils/Uuid";
import { createResponseForm } from "../interceptors/Transformer";
import typia from "typia";
import { EMAIL_SEND_FAILED } from "../errors/email-error";
import { isErrorCheck } from "../errors";

@JsonController("/email")
@Service()
export class EmailController {
  constructor(
    private readonly _emailService: EmailService,
    private readonly _authService: AuthService
  ) {}

  @HttpCode(201)
  @Post("/verify/send")
  @OpenAPI({
    description: "인증 이메일을 보냅니다."
  })
  public async sendVerifyEmail(@BodyParam("email") email: string) {
    return this._emailService.sendVerify(email);
  }
  @HttpCode(201)
  @Post("/verify/auth")
  @OpenAPI({
    description: "인증 이메일을 확인합니다."
  })
  public async checkVerifyEmail(@Body() emailVerifyDto: EmailVerifyDto) {
    return this._emailService.authVerify(emailVerifyDto);
  }
  @HttpCode(201)
  @Post("/resetPassword")
  @OpenAPI({
    description: "비밀번호를 초기화 합니다."
  })
  public async sendResetPassword(@Body() emailVerifyDto: EmailVerifyDto) {
    const result = await this._emailService.authVerify(emailVerifyDto);
    if(isErrorCheck(result))
      return result;
    if (result) {
      const { email } = emailVerifyDto;
      const password = await UUID();
      try {
        await this._authService.changePassword(email, password);
        await this._emailService.sendPassword(email, password);
        return createResponseForm(undefined);
      } catch {
        typia.random<EMAIL_SEND_FAILED>();
      }
    } 
  }
}


import { Body, BodyParam, HttpCode, JsonController, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { EmailVerifyDto } from '../dtos/AuthDto';
import { EmailService } from '../services/EmailService';

@JsonController("/email")
@Service()
export class EmailController{
    
    
    constructor(private emailService:EmailService){}
    
    @HttpCode(200)
    @Post('/verify/send')
    @OpenAPI({
        description: "인증 이메일을 보냅니다.",
      })
    public async VerifySend(@BodyParam('email')email: string) {
      console.log(email);
        return this.emailService.sendVerify(email); 
    }
    @HttpCode(200)
    @Post('/verify/auth')
    @OpenAPI({
        description: "인증 이메일을 확인합니다.",
      })
    public async VerifyAuth(@Body()emailVerifyDto: EmailVerifyDto) {
        return this.emailService.authVerify(emailVerifyDto);       
    }
}
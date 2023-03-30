import { Body, BodyParam, HttpCode, JsonController, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { EmailVerifyDto } from '../dtos/AuthDto';
import { AuthService } from '../services';
import { EmailService } from '../services/EmailService';
import { UUID } from '../utils/Uuid';

@JsonController("/email")
@Service()
export class EmailController{
    
    
    constructor(private readonly _emailService:EmailService,
          private readonly _authService:AuthService,
      ){} 
    
    @HttpCode(201)
    @Post('/verify/send')
    @OpenAPI({
        description: "인증 이메일을 보냅니다.",
      })
    public async verifySend(@BodyParam('email')email: string) {
      console.log(email);
        return this._emailService.sendVerify(email); 
    }
    @HttpCode(201)
    @Post('/verify/auth')
    @OpenAPI({
        description: "인증 이메일을 확인합니다.",
      })
    public async verifyAuth(@Body()emailVerifyDto: EmailVerifyDto) {
        return this._emailService.authVerify(emailVerifyDto);       
    }
    @HttpCode(201)
    @Post('/resetPassword')
    @OpenAPI({
      description:"비밀번호를 초기화 합니다."
    })
    public async resetPassword(@Body()emailVerifyDto : EmailVerifyDto){
      const result = await this._emailService.authVerify(emailVerifyDto);
      if(result){
        const {email} = emailVerifyDto;
        const password = await UUID();
        try{
          await this._authService.changePassword(email,password);
          await this._emailService.sendPassword(email,password);
          return {
            status:true,
            message:"새로운 비밀번호를 이메일로 전송했습니다."
          }
        }
        catch(err){
          return {
            status:false,
            message:err
          }
        }
      }
      else{
        return {
          status:false,
          message:"인증번호가 일치하지 않습니다!"
        }
      } 
    }
}
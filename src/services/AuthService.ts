import  { Service } from "typedi";
import { CreateUserDto } from "../dtos/UserDto";
import { UserRepository } from "../repositories";
@Service()
export class AuthService{
    constructor(private userRepository :typeof UserRepository){};
    public async localRegister(createUserDto : CreateUserDto){
        const user = createUserDto.toEntity();
        return await this.userRepository.save(user);
    }
}
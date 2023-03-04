import { User } from "../entities";
import jwt from 'jsonwebtoken';
import {env} from '../loaders/env';
const jwtAccessSecret = env.app.jwtAccessSecret;
const jwtRefreshSecret = env.app.jwtRefreshSecret;
export function generateAccessToken (user : User){
    return jwt.sign({
        userId : user.id, userEmail : user.email
    },
    jwtAccessSecret,{
        expiresIn:"30m"
    }
    )
}


export function generateRefreshToken (user:User){
    return jwt.sign({
        userId : user.id, userEmail : user.email
    },
    jwtRefreshSecret,{
        expiresIn:"30m"
    }
    )
}

export function generateToken(user:User){
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return {
        accessToken,
        refreshToken
    }
}
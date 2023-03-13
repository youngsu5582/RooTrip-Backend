import { User } from "../entities";
import jwt from 'jsonwebtoken';
import {env} from '../loaders/env';
const jwtAccessSecret = env.app.jwtAccessSecret;
const jwtRefreshSecret = env.app.jwtRefreshSecret;
export function generateAccessToken (user : User){
    return jwt.sign({
        userId : user.id
    },
    jwtAccessSecret,{
        expiresIn:"15m"
    }
    )
}


export function generateRefreshToken (user:User){
    return jwt.sign({
        userId : user.id
    },
    jwtRefreshSecret,{
        expiresIn:"1d"
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
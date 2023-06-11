import {  GetPostsDto, RegionType } from "../dtos/PostDto";


export function isCityType(dto: GetPostsDto): dto is RegionType {
    return dto.viewType === 'region';
  }
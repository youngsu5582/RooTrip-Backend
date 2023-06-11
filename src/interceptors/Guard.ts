import {  CityType  } from "../dtos/PostDto";

export function isCityType(dto: any): dto is CityType  {
    return dto.viewType ==="city" ;
  }
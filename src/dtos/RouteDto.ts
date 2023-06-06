import {  ArrayMaxSize, ArrayMinSize, IsArray } from "class-validator";
export type RegionType = "서울특별시" | "대구광역시" | "부산광역시" | "충청남도" | "충청북도"|"대전광역시"|"세종특별자치시"|"울산광역시"|"전라남도"|"전라북도"|"제주특별자치도"|"인천광역시"




export class RouteDto {
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(3)
    cities: Array<RegionType>;
  }
  
import {  ArrayMaxSize, ArrayMinSize, IsArray } from "class-validator";
export type RegionType = "서울" | "대구" | "부산" | "충청남도" | "충청북도"|"대전"|"세종"|"울산"|"전라남도"|"전라북도"|"제주도"|"인천"




export class RouteDto {
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(3)
    cities: Array<RegionType>;
  }
  
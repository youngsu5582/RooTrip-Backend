import { articleType } from "../types";

export interface CreatePostInterface{
    article : articleType;
  
    newPhotos : photoInterface[];
    /**
     * @type int
     */
    routes : number[];
  }
  interface photoInterface {
    /**
     * @type int
     * @min 1
     * @max 10
     */
    id: number;
      /**
     * @type int
     * @min 1
     * @max 10
     */
    feedOrder: number;
    fileName: string;
  
    /**
     * @pattern ^(?:https?|ftp):\/\/[\S]+$
     */
    image_url: string;
  
    dateTime: Date;
    /**
     * @minimum 33
     * @maximum 38
     */
    latitude: number;
    /**
     * @minimum 125
     * @maximum 131
     */
    longitude: number;
  }
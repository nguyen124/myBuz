export interface IItem {
  _id: string;
  title: string;
  titleUrl: string;
  url: string;
  thumbnail: string,
  modifiedDate?: number;
  createdBy?: object;
  tags?: string[];
  categories?: string[];
  creditBy?: string[];
  point?: number;
  seen?: number;
  share?: number;
  comment?: number;
  status?: boolean;
  isAdult?: boolean;
  isSafeAtWork: boolean;
  isSensitive: boolean;
  isAutoPlayed: boolean;
  hasSound: boolean;
  length: number;
}

export interface IItem {
  _id?: string;
  title: string;
  titleUrl?: string;
  url?: string;
  thumbnail?: string,
  modifiedDate?: number;
  createdBy?: object;
  tags?: string[];
  categories?: string[];
  creditBy?: string[];
  noOfPoints?: number;
  noOfComments?: number;
  noOfSeens?: number;
  noOfShares?: number;
  upvoted?:boolean;
  downvoted?:boolean;
  status?: string;
  isAdult?: boolean;
  isSafeAtWork?: boolean;
  isSensitive?: boolean;
  isAutoPlayed?: boolean;
  hasSound?: boolean;
  length?: number;
  description?: string;
}

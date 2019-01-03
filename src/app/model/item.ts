export interface IItem {
  _id: String;
  title: string;
  titleUrl: string;
  url: string;
  thumbnail: string,
  modifiedDate?: number;
  createdBy?: Object;
  tags?: String[];
  categories?: String[];
  creditBy?: String[];
  point?: Number;
  seen?: Number;
  share?: Number;
  comment?: Number;
  status?: Boolean;
  isAdult?: Boolean;
  isSafeAtWork: Boolean;
  isSensitive: Boolean;
  isAutoPlayed: Boolean;
  hasSound: Boolean;
  length: Number;
}

// export class Item implements IItem {
//   description?: string;

//   count(): number {
//     throw new Error("Method not implemented.");
//   }

//   constructor(public id: number, public code: string, public title: string, public url: string, public modifiedDate: string, public viewed: string) {

//   }
// }
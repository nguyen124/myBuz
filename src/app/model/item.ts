export interface IItem {
  code?: string;
  title: string;
  description?: string;
  url: string;
  modifiedDate: string;
  viewed: string;
  createdBy: string;
  commentedBy: string;
}

// export class Item implements IItem {
//   description?: string;

//   count(): number {
//     throw new Error("Method not implemented.");
//   }

//   constructor(public id: number, public code: string, public title: string, public url: string, public modifiedDate: string, public viewed: string) {

//   }
// }
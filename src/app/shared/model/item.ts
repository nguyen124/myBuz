export interface IItem {
  _id?: string;
  title?: string;
  businessName: string;
  files?: any[];
  modifiedDate?: string;
  createdBy?: any;
  tags?: string[];
  categories?: [string];
  noOfPoints?: number;
  noOfViews?: number;
  noOfComments?: number;
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;
  hasReported?: boolean;
  price: number;
  address: string;
  zipcode: string;
  city: string;
  state?: string;
  country: string;
  noOfEmployees: number;
  noOfChairs?: number;
  noOfTables?: number;
  contactPhoneNo: string;
  contactEmail?: string;
  income: number;
  rentCost: number;
  otherCost: number;
  leaseEnd: string;
  yearOld?: number;
  area: number;
  description?: string;
}

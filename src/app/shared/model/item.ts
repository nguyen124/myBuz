export interface IItem {
  _id?: string;
  title: string;
  url?: string;
  modifiedDate?: number;
  createdBy?: object;
  tags?: string[];
  categories?: [string];
  noOfPoints?: number;
  noOfComments?: number;
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;
  hasReported?: boolean;
}

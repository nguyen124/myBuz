export interface IItem {
  _id?: string;
  title?: string;
  files?: any[];
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

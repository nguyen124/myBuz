export interface INode {
    _id?: string;
    title?: string;
    files?: any[];
    modifiedDate?: number;
    createdBy?: any;
    tags?: string[];
    categories?: [string];
    noOfPoints?: number;
    noOfViews?: number;
    noOfComments?: number;
    hasUpvoted?: boolean;
    hasDownvoted?: boolean;
    hasReported?: boolean;
    description?: string;
}

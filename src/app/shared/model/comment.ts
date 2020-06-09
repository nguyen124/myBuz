import { Mask } from './mask';
export interface IComment extends Mask {
    _id?: string;
    parentCommentId?: string;
    content?: any[];
    modifiedDate: string;
    writtenBy: any;
    itemId: string;
    noOfPoints?: number;
    noOfReplies?: number;
    hasUpvoted?: boolean;
    hasDownvoted?: boolean;
    hasReported?: boolean;    
    replies?: IComment[];
    replyTo: any;
}

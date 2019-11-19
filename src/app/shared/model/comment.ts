export interface IComment {
    _id: string;
    parentCommentId?: string;
    content: string;
    modifiedDate: string;
    writtenBy: object;
    itemId: string;
    replyTo?: object;
    noOfPoints?: number;
    noOfReplies?: number;
    hasUpvoted?: boolean;
    hasDownvoted?: boolean;
    hasReported?: boolean;
    replies?: IComment[];
}

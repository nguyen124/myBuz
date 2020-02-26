export interface IComment {
    _id?: string;
    parentCommentId?: string;
    content?: object[];
    modifiedDate: string;
    writtenBy: object;
    itemId: string;
    noOfPoints?: number;
    noOfReplies?: number;
    hasUpvoted?: boolean;
    hasDownvoted?: boolean;
    hasReported?: boolean;
    replies?: IComment[];
    showCommentBox?: boolean;
    showToolTip?: boolean;
}

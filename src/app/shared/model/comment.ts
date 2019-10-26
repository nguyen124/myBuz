export interface IComment {
    _id: string;   
    parentCommentId?: string;
    content: string;
    url?: string;
    modifiedDate: string;
    writtenBy: object;
    itemId: string;
    replyTo?: object;
    noOfPoints?: number;
    upvoted?:boolean;
    downvoted?:boolean;
    replies?: IComment[];
    totalReplies?: number;
}

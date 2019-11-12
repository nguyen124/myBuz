export interface IComment {
    _id: string;   
    parentCommentId?: string;
    content: string;
    modifiedDate: string;
    writtenBy: object;
    itemId: string;
    replyTo?: object;
    noOfPoints?: number;
    upvoted?:boolean;
    downvoted?:boolean;
    replies?: IComment[];
    noOfReplies?: number;
}

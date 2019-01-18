export interface IComment {
    _id: string;   
    parentCommentId?: string;
    content: string;
    url?: string;
    modifiedDate: string;
    writtenBy: object;
    itemId: string;
    replyTo?: object;
    point?: number;    
}

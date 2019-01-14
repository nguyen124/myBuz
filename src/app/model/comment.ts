export interface IComment {
    _id: string;
    content: string;
    url: string;
    modifiedDate: string;    
    commmentedBy: string;
    itemId: string;
    replyTo?: object;
    point?: number;
}

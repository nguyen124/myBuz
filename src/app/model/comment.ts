export interface IComment {
    content: string;
    url: string;
    modifiedDate: string;    
    commmentedBy: string;
    itemId: string;
    replyTo?: string;
}

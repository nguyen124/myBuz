export interface IItemUserLog {
    _id: string;
    itemId: string;
    userId: string;
    upVoted?: number;
    downVoted?: number;
}
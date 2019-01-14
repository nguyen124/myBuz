export interface ICommentUserLog {
    _id: string;
    commentId: string;
    userId: string;
    upVoted?: number;
    downVoted?: number;
}
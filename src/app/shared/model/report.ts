
export interface IReport {
    _id?: string;
    reportedItemId?: string;
    reportedCommentId?: string;
    reasons: string[];
    reportedByUser?: any,
    reportedDate?: Date,
    status?: String
}

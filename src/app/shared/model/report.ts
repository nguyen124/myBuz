
export interface IReport {
    _id?: string;
    reportedItemId?: string;
    reportedCommentId?: string;
    reasons: string[];
    reportedByUser?: object,
    reportedDate?: Date,
    status?: String
}

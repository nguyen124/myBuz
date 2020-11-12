
export interface IReport {
    _id?: string;
    reportedItemId?: string;
    reportedCommentId?: string;
    reasons: string[];
    content: any[];
    reportedByUser?: any,
    reportedDate?: Date,
    status?: String
}

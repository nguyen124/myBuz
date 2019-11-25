export interface INotification {
    _id?: string;
    title: string;
    message: string;
    itemId?: string;
    userId?: string;
    notifiedDate: Date,
    hasRead: Boolean
}

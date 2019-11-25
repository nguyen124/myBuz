export interface INotification {
    _id?: string;
    message: string;
    itemId?: string;
    userId?: string;
    notifiedDate: Date,
    status: Boolean
}

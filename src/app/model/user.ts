export interface IUser {
    _id: string;
    email: string;
    avatar: string;
    password: string;
    joinedDate: string,
    rank?: string;
    status?: string;
    follower?: number;
}
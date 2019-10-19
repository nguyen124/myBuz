export interface IUser {
    _id: string;
    email?: string;
    userName?: string;
    avatar?: string;
    password?: string;
    joinedDate?: string,
    rank?: string;
    status?: string;
    noOfFollowers?: number;    
}
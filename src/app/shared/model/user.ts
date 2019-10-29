export interface IUser {
    _id: string;
    email?: string;
    username?: string;
    avatar?: string;
    password?: string;
    joinedDate?: string,
    rank?: string;
    status?: string;
    noOfFollowers?: number;
    accessToken?: string;
    googleId?: string;
    familyName?: string;
    givenName?: string;
}
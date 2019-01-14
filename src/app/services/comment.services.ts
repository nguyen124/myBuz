import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';


@Injectable()
export class CommentService {

    constructor(private _http: HttpClient) {

    }

    getComments(commentId: String): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId);
    }

    getCommentsOfItem(itemId: string): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments");
    }

    upVoteComment(commentId: string, userId: string): any {
        return this._http.put("/svc/comments/upVote", { "commentId": commentId, "userId": userId });
    }

    unUpVoteComment(commentId: string, userId: string): any {
        return this._http.put<IComment>("/svc/comments/unUpVote", { "commentId": commentId, "userId": userId });
    }

    downVoteComment(commentId: string, userId: string): any {
        return this._http.put<IComment>("/svc/comments/downVote", { "commentId": commentId, "userId": userId });
    }

    unDownVoteComment(commentId: string, userId: string): any {
        return this._http.put<IComment>("/svc/comments/unDownVote", { "icommentIdtemId": commentId, "userId": userId });
    }

    getCommentUserLog(commentId: string, userId: string): any {
        return this._http.get<boolean>("/svc/comments/" + commentId + "/users/" + userId);
    }

}
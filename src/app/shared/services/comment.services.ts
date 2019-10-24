import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';


@Injectable()
export class CommentService {
    constructor(
        private _http: HttpClient) {
    }

    hasVoted(id: string, model: string): Observable<number> {
        return this._http.post<number>("/svc/current-user/has-voted/", { modelId: id, model: model });
    }

    upvote(id: string, model: string): Observable<number> {
        return this._http.put<number>("/svc/current-user/upvote", { modelId: id, model: model });
    }

    unvote(id: string, model: string): Observable<number> {
        return this._http.put<number>("/svc/current-user/unvote", { modelId: id, model: model });
    }

    downvote(id: string, model: string): Observable<number> {
        return this._http.put<number>("/svc/current-user/downvote", { modelId: id, model: model });
    }

    addComment(itemId: string, content: string): Observable<any> {
        return this._http.post<any>('/svc/current-user/comment', {
            itemId: itemId,
            content: content,
            modifiedDate: Date.now()
        });
    }

    addReplyToComment(commentId: string, replyContent: string): any {
        return this._http.post<any>('/svc/current-user/comment', {
            parentCommentId: commentId,
            content: replyContent,
            modifiedDate: Date.now()
        });
    }

    getComments(commentId: string): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId);
    }

    getRepliesOfComment(commentId: string): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId + "/replies");
    }

    getTotalRepliesOfComment(commentId: any): any {
        return this._http.get<IComment[]>("/svc/comments/" + commentId + "/totalReplies");
    }

    addVoiceReplyToComment(commentId: string, url: any): any {
        return this._http.post<any>('/svc/current-user/reply', {
            parentCommentId: commentId,
            url: url,
            modifiedDate: Date.now()
        });
    }
}
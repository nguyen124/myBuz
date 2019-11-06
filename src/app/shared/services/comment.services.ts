import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';


@Injectable()
export class CommentService {
    parentCommentId: string;

    constructor(
        private _http: HttpClient) {
    }

    hasVoted(id: string): Observable<number> {
        return this._http.post<number>("/svc/current-user/has-voted/", { modelId: id });
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

    addComment(itemId: string, content: string, url: string): Observable<any> {
        return this._http.post<any>('/svc/current-user/comment', {
            parentCommentId: this.parentCommentId,
            itemId: itemId,
            content: content,
            url: url
        });
    }

    getCommentsOfItem(itemId: string, page: number): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments?page=" + page);
    }

    getRepliesOfComment(commentId: string, page: number): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId + "/replies?page=" + page);
    }
}
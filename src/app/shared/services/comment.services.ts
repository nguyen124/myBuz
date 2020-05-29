import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';
import { JQ_TOKEN } from './jQuery.service';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    constructor(
        private _http: HttpClient,
        @Inject(JQ_TOKEN) private $: any) {
    }

    upvote(itemId?: string, commentId?: string): Observable<number> {
        return this._http.put<number>("/svc/current-user/upvote", { itemId: itemId, commentId: commentId });
    }

    unvote(itemId?: string, commentId?: string): Observable<number> {
        return this._http.put<number>("/svc/current-user/unvote", { itemId: itemId, commentId: commentId });
    }

    downvote(itemId?: string, commentId?: string): Observable<number> {
        return this._http.put<number>("/svc/current-user/downvote", { itemId: itemId, commentId: commentId });
    }

    addComment(comment: IComment): Observable<any> {
        return this._http.post<any>('/svc/current-user/comment', comment);
    }

    updateComment(comment: IComment, newCommentContent: any[]): Observable<any> {
        return this._http.put<any>(`/svc/items/${comment.itemId}/comments/${comment._id}`, {
            content: newCommentContent
        });
    }

    getCommentsOfItem(itemId: string, params): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments", { params: params });
    }

    getRepliesOfComment(commentId: string, params): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId + "/replies", { params: params });
    }

    deleteComment(itemId: string, commentId: string): Observable<any> {
        return this._http.delete(`/svc/items/${itemId}/comments/${commentId}`);
    }

    getCommentById(commentId) {
        return this._http.get<IComment>(`/svc/comments/${commentId}`);
    }

    removeElement(el) {
        if (el) {
            el.remove();
        }
    }
}
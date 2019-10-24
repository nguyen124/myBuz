import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';
import { LoggingService } from './system/logging.service';
import { AuthService } from './security/auth.service';


@Injectable()
export class CommentService {
    constructor(
        private _http: HttpClient,
        private _authSvc: AuthService) {
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

    getComments(commentId: string): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId);
    }

    getRepliesOfComment(commentId: string): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId + "/replies");
    }

    getTotalRepliesOfComment(commentId: any): any {
        return this._http.get<IComment[]>("/svc/comments/" + commentId + "/totalReplies");
    }

    addReplyToComment(commentId: string, replyContent: string): any {
        return this._http.post<any>('/svc/comments/reply', {
            parentCommentId: commentId,
            content: replyContent,
            modifiedDate: (new Date()).getTime(),
            writtenBy: {
                userId: this._authSvc.user._id,
                userName: this._authSvc.user.userName,
                avatar: this._authSvc.user.avatar
            }
        });
    }

    addVoiceReplyToComment(commentId: string, url: any): any {
        return this._http.post<any>('/svc/comments/reply', {
            parentCommentId: commentId,
            url: url,
            modifiedDate: (new Date()).getTime(),
            writtenBy: {
                userId: this._authSvc.user._id,
                userName: this._authSvc.user.userName,
                avatar: this._authSvc.user.avatar
            }
        });
    }
}
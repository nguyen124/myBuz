import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';
import { ICommentUserLog } from '../model/commentUserLog';
import { LoggingService } from './system/logging.service';
import { AuthService } from './security/auth.service';


@Injectable()
export class CommentService {
    constructor(
        private _http: HttpClient,
        private _log: LoggingService,
        private _authSvc: AuthService) {
    }

    getCommentInfo(comment: IComment): void {
        this.getCommentUserLog(comment._id, this._authSvc.user._id).subscribe((commentUserLog: ICommentUserLog) => {
            if (commentUserLog) {
                if (commentUserLog.upVoted) {
                    comment["upVotedClass"] = "voted";
                    comment["extraDownVotePoint"] = 2;
                } else if (commentUserLog.downVoted) {
                    comment["downVotedClass"] = "voted";
                    comment["extraUpVotePoint"] = 2;
                } else {
                    comment["extraUpVotePoint"] = 1;
                    comment["extraDownVotePoint"] = 1;
                }
            }
        });
    }

    upVote(comment: IComment): void {
        comment["extraDownVotePoint"] = 2;
        if (!comment["upVotedClass"]) {
            if (!comment["extraUpVotePoint"]) {
                comment["extraUpVotePoint"] = 1;
            }
            comment.point += comment["extraUpVotePoint"];
            this.upVoteComment(comment._id, this._authSvc.user._id).subscribe(res => {
                this._log.log(res);
            });
            comment["upVotedClass"] = "voted";
        } else {
            comment["upVotedClass"] = "";
            comment["extraUpVotePoint"] = 1;
            comment["extraDownVotePoint"] = 1;
            comment.point--;
            this.unUpVoteComment(comment._id, this._authSvc.user._id).subscribe(res => {
                this._log.log(res);
            });
        }
        comment["downVotedClass"] = "";
    }

    downVote(comment: IComment) {
        comment["extraUpVotePoint"] = 2;
        if (!comment["downVotedClass"]) {
            if (!comment["extraDownVotePoint"]) {
                comment["extraDownVotePoint"] = 1;
            }
            comment.point -= comment["extraDownVotePoint"];
            this.downVoteComment(comment._id, this._authSvc.user._id).subscribe(res => {
                this._log.log(res);
            });
            comment["downVotedClass"] = "voted";
        } else {
            comment["extraUpVotePoint"] = 1;
            comment["extraDownVotePoint"] = 1;
            comment["downVotedClass"] = "";
            comment.point++;
            this.unDownVoteComment(comment._id, this._authSvc.user._id).subscribe(res => {
                this._log.log(res);
            });
        }
        comment["upVotedClass"] = "";

    }

    getComments(commentId: String): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId);
    }

    getRepliesOfComment(commentId: string): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId + "/replies");
    }
    getTotalRepliesOfComment(commentId: any): any {
        return this._http.get<IComment[]>("/svc/comments/" + commentId + "/totalReplies");
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
        return this._http.put<IComment>("/svc/comments/unDownVote", { "commentId": commentId, "userId": userId });
    }

    getCommentUserLog(commentId: string, userId: string): any {
        return this._http.get<boolean>("/svc/comments/" + commentId + "/users/" + userId);
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
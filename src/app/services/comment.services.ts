import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';
import { IUser } from '../model/user';
import { Router } from '@angular/router';
import { ICommentUserLog } from '../model/commentUserLog';


@Injectable()
export class CommentService {
    user: IUser;

    constructor(private _router: Router, private _http: HttpClient) {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    getCommentInfo(comment: IComment): void {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        if (this.user) {
            this.getCommentUserLog(comment._id, this.user._id).subscribe((commentUserLog: ICommentUserLog) => {
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
    }

    upVote(comment: IComment): void {
        if (this.user) {
            comment["extraDownVotePoint"] = 2;
            if (!comment["upVotedClass"]) {
                if (!comment["extraUpVotePoint"]) {
                    comment["extraUpVotePoint"] = 1;
                }
                comment.point += comment["extraUpVotePoint"];
                this.upVoteComment(comment._id, this.user._id).subscribe(res => {
                    console.log(res);
                });
                comment["upVotedClass"] = "voted";
            } else {
                comment["upVotedClass"] = "";
                comment["extraUpVotePoint"] = 1;
                comment["extraDownVotePoint"] = 1;
                comment.point--;
                this.unUpVoteComment(comment._id, this.user._id).subscribe(res => {
                    console.log(res);
                });
            }
            comment["downVotedClass"] = "";
        } else {
            this._router.navigate(['/login']);
        }
    }

    downVote(comment: IComment) {
        if (this.user) {
            comment["extraUpVotePoint"] = 2;
            if (!comment["downVotedClass"]) {
                if (!comment["extraDownVotePoint"]) {
                    comment["extraDownVotePoint"] = 1;
                }
                comment.point -= comment["extraDownVotePoint"];
                this.downVoteComment(comment._id, this.user._id).subscribe(res => {
                    console.log(res);
                });
                comment["downVotedClass"] = "voted";
            } else {
                comment["extraUpVotePoint"] = 1;
                comment["extraDownVotePoint"] = 1;
                comment["downVotedClass"] = "";
                comment.point++;
                this.unDownVoteComment(comment._id, this.user._id).subscribe(res => {
                    console.log(res);
                });
            }
            comment["upVotedClass"] = "";
        } else {
            this._router.navigate(['/login']);
        }
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
        if (this.user) {
            return this._http.post<any>('/svc/comments/reply', {
                parentCommentId: commentId,
                content: replyContent,
                modifiedDate: (new Date()).getTime(),
                writtenBy: {
                    userId: this.user._id,
                    userName: this.user.userName,
                    avatar: this.user.avatar
                }
            });
        } else {
            this._router.navigate(['/login']);
        }
    }
}
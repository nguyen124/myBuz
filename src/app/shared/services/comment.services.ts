import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';
import { JQ_TOKEN } from './jQuery.service';

@Injectable()
export class CommentService {
    parentCommentId: string;
    latestComment: IComment;
    edittingComment: IComment;
    edittingCommentIndex: number;

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

    addComment(itemId: string, content: string): Observable<any> {
        return this._http.post<any>('/svc/current-user/comment', {
            parentCommentId: this.parentCommentId,
            itemId: itemId,
            content: content
        });
    }

    updateComment(comment: IComment, content: string): Observable<any> {
        return this._http.put<any>(`/svc/items/${comment.itemId}/comments/${comment._id}`, {
            content: content
        });
    }

    getCommentsOfItem(itemId: string, params): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments", { params: params });
    }

    getRepliesOfComment(commentId: string, params): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId + "/replies", { params: params });
    }

    deleteComment(comment: IComment): Observable<any> {
        return this._http.delete(`/svc/items/${comment.itemId}/comments/${comment._id}`);
    }

    populateDataToCommentbox(comment: IComment, index: number) {
        this.$("#txtReplyBox").html(comment.content);
        var that = this;
        var removePicBtn = this.$(`
                <button class="btn btn-xs btn-primary upright-corner" id="removePicBtn"> 
                    <span aria-hidden="true">&times;</span>
                </button>`),
            previewPicDiv = this.$("#previewPicDiv"),
            removeVoiceBtn = this.$(`
                <button class="btn btn-xs btn-primary upright-corner" id="removeVoiceBtn"> 
                    <span aria-hidden="true">&times;</span>
                </button>`),
            previewVoiceDiv = this.$("#previewVoiceDiv");
        removePicBtn.bind("click", () => {
            that.removeElement(previewPicDiv)
        });
        removeVoiceBtn.bind("click", () => {
            that.removeElement(previewVoiceDiv)
        });
        if (previewPicDiv) {
            previewPicDiv.append(removePicBtn);
        }
        if (previewVoiceDiv) {
            previewVoiceDiv.append(removeVoiceBtn);
        }
        this.edittingComment = comment;
        this.edittingCommentIndex = index;
    }

    removeElement(el) {
        if (el) {
            el.remove();
        }
    }

    getYourComments(comments, userId) {
        var yourComments = comments.filter((comment, index) => {
            return comment.writtenBy["userId"] === userId;
        });
        return yourComments;
    }
}
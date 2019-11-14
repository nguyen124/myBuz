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

    addComment(itemId: string, content: string): Observable<any> {
        return this._http.post<any>('/svc/current-user/comment', {
            parentCommentId: this.parentCommentId,
            itemId: itemId,
            content: content
        });
    }

    updateComment(commentId: string, content: string): Observable<any> {
        return this._http.put<any>('/svc/current-user/comments/' + commentId, {
            content: content
        });
    }

    getCommentsOfItem(itemId: string, page: number): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments?page=" + page);
    }

    getRepliesOfComment(commentId: string, page: number): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/comments/" + commentId + "/replies?page=" + page);
    }

    deleteComment(commentId: string): Observable<any> {
        return this._http.delete("/svc/current-user/comments/" + commentId);
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
}
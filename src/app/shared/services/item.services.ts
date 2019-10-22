import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IItemUserLog } from '../model/itemUserLog';
import { IComment } from '../model/comment';
import { LoggingService } from './system/logging.service';
import { AuthService } from './security/auth.service';

@Injectable()
export class ItemService {
    constructor(
        private _http: HttpClient,
        private _log: LoggingService,
        private _authSvc: AuthService) {
    }

    getItemInfo(comment: IItem): void {
        if (this._authSvc.user) {
            this.getItemUserLog(comment._id, this._authSvc.user._id).subscribe((commentUserLog: IItemUserLog) => {
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

    upVote(item: IItem): void {
        item["extraDownVotePoint"] = 2;
        if (!item["upVotedClass"]) {
            if (!item["extraUpVotePoint"]) {
                item["extraUpVotePoint"] = 1;
            }
            item.point += item["extraUpVotePoint"];
            this.upVoteItem(item._id).subscribe(res => {
                this._log.log(res);
            });
            item["upVotedClass"] = "voted";
        } else {
            item["upVotedClass"] = "";
            item["extraUpVotePoint"] = 1;
            item["extraDownVotePoint"] = 1;
            item.point--;
            this.unUpVoteItem(item._id).subscribe(res => {
                this._log.log(res);
            });
        }
        item["downVotedClass"] = "";

    }

    downVote(item: IItem) {
        if (this._authSvc.user) {
            item["extraUpVotePoint"] = 2;
            if (!item["downVotedClass"]) {
                if (!item["extraDownVotePoint"]) {
                    item["extraDownVotePoint"] = 1;
                }
                item.point -= item["extraDownVotePoint"];
                this.downVoteItem(item._id, this._authSvc.user._id).subscribe(res => {
                    this._log.log(res);
                });
                item["downVotedClass"] = "voted";
            } else {
                item["extraUpVotePoint"] = 1;
                item["extraDownVotePoint"] = 1;
                item["downVotedClass"] = "";
                item.point++;
                this.unDownVoteItem(item._id, this._authSvc.user._id).subscribe(res => {
                    this._log.log(res);
                });
            }
            item["upVotedClass"] = "";
        }
    }

    getItems(): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/items");
    }

    getItemsOfUser(userId: String): any {
        return this._http.get<IItem[]>("/svc/users/" + userId + "/items");
    }

    getCommentsOfItem(itemId: string): Observable<IComment[]> {
        return this._http.get<IComment[]>("/svc/items/" + itemId + "/comments");
    }

    addCommentToItem(itemId: string, content: string): Observable<any> {
        return this._http.post<any>('/svc/items/comment', {
            itemId: itemId,
            content: content,
            modifiedDate: (new Date()).getTime(),
            writtenBy: {
                userId: this._authSvc.user._id,
                userName: this._authSvc.user.userName,
                avatar: this._authSvc.user.avatar
            }
        });
    }

    addVoiceCommentToItem(itemId: string, url: any): any {
        if (this._authSvc.user) {
            return this._http.post<any>('/svc/items/comment', {
                itemId: itemId,
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

    updateItem(item: Object): void {
        this._http.put("/svc/items", item);
    }

    upVoteItem(itemId: String): Observable<any> {
        return this._http.put("/svc/items/upVote", { "itemId": itemId });
    }

    unUpVoteItem(itemId: String, userId: String): any {
        return this._http.put<IItem>("/svc/items/unUpVote", { "itemId": itemId, "userId": userId });
    }

    downVoteItem(itemId: String, userId: String): Observable<IItem> {
        return this._http.put<IItem>("/svc/items/downVote", { "itemId": itemId, "userId": userId });
    }

    unDownVoteItem(itemId: String, userId: String): any {
        return this._http.put<IItem>("/svc/items/unDownVote", { "itemId": itemId, "userId": userId });
    }

    getItemUserLog(itemId: string, userId: string): any {
        return this._http.get<boolean>("/svc/items/" + itemId + "/users/" + userId);
    }

    createItem(item: IItem) {
        return this._http.post("/svc/items", item);
    }
}
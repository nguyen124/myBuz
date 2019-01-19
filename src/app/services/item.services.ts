import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { IUser } from '../model/user';
import { IItemUserLog } from '../model/itemUserLog';


@Injectable()
export class ItemService {
    user: IUser;
    constructor(private _router: Router, private _http: HttpClient) {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
    getItemInfo(comment: IItem): void {
        if (this.user) {
            this.getItemUserLog(comment._id, this.user._id).subscribe((commentUserLog: IItemUserLog) => {
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
        if (this.user) {
            item["extraDownVotePoint"] = 2;
            if (!item["upVotedClass"]) {
                item.point += item["extraUpVotePoint"];
                this.upVoteItem(item._id, this.user._id).subscribe(res => {
                    console.log(res);
                });
                item["upVotedClass"] = "voted";
            } else {
                item["upVotedClass"] = "";
                item["extraUpVotePoint"] = 1;
                item["extraDownVotePoint"] = 1;
                item.point--;
                this.unUpVoteItem(item._id, this.user._id).subscribe(res => {
                    console.log(res);
                });
            }
            item["downVotedClass"] = "";
        } else {
            this._router.navigate(['/login']);
        }
    }

    downVote(item: IItem) {
        if (this.user) {
            item["extraUpVotePoint"] = 2;
            if (!item["downVotedClass"]) {
                item.point -= item["extraDownVotePoint"];
                this.downVoteItem(item._id, this.user._id).subscribe(res => {
                    console.log(res);
                });
                item["downVotedClass"] = "voted";
            } else {
                item["extraUpVotePoint"] = 1;
                item["extraDownVotePoint"] = 1;
                item["downVotedClass"] = "";
                item.point++;
                this.unDownVoteItem(item._id, this.user._id).subscribe(res => {
                    console.log(res);
                });
            }
            item["upVotedClass"] = "";
        } else {
            this._router.navigate(['/login']);
        }
    }

    getItems(): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/items");
    }

    getItemComments(itemId: String): Observable<IItem[]> {
        return this._http.get<IItem[]>("/svc/items/" + itemId + "/comments/");
    }

    updateItem(item: Object): void {
        this._http.put("/svc/items", item);
    }

    upVoteItem(itemId: String, userId: String): Observable<any> {
        return this._http.put("/svc/items/upVote", { "itemId": itemId, "userId": userId });
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
}
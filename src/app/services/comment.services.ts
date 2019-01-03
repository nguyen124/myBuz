import { Injectable } from '@angular/core';
import { IItem } from '../model/item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IComment } from '../model/comment';


@Injectable()
export class CommentService {
    constructor(private _http: HttpClient) {

    }

    getUpvoteComments(commentId: String): Observable<IComment[]> {
        return this._http.get<IComment[]>("http://localhost:3000/svc/comments/" + commentId);
    }
}
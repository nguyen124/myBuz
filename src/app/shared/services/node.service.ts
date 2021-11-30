import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INode } from '../model/node';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private _http: HttpClient) { }

  createNode(node): Observable<INode> {
    return this._http.post<INode>("/svc/nodes/create", node);
  }
}
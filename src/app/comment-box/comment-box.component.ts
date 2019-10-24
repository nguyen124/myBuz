import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { ItemService } from '../shared/services/item.services';
import { IItem } from '../shared/model/item';
import { IComment } from '../shared/model/comment';
import { CommentService } from '../shared/services/comment.services';
import { VoiceMessageServiceService } from '../shared/services/voice-message.service';
import { Subscription } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { LoggingService } from '../shared/services/system/logging.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit, OnDestroy {
  @Input()
  item: IItem;
  comment: IComment;
  isRecording: boolean;
  isUploading: boolean;
  commentContent: string;
  commentType: string = "ItemComment";
  subscription: Subscription;

  constructor(private _itemSvc: ItemService,
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    private _voiceSvc: VoiceMessageServiceService,
    private _log: LoggingService,
    private http: HttpClient) {

  }

  ngOnInit() {
    this.subscription = this._commSvc.currentComment$.subscribe(reply => {
      if (reply) {
        this.comment = reply;
        this.commentType = "ReplyComment";
      }
    })
  }

  writeTextComment() {
    if (this.commentContent && this.commentContent.trim()) {
      if (this.commentType === "ItemComment") {
        this._log.log("Comment Content: " + this.commentContent);
        this._commentSvc.addComment(this.item._id, this.commentContent).subscribe(comment => {
          this.commentContent = ""
          this._commSvc.changeComment(comment);
        });
      } else if (this.commentType === "ReplyComment") {
        this._log.log("Comment Content: " + this.commentContent);
        if (this.comment.parentCommentId) {
          this._commentSvc.addReplyToComment(this.comment.parentCommentId, this.commentContent).subscribe(comment => {
            this.commentContent = "";
            this.commentType = "ItemComment";
            this._commSvc.onAddNewReply(comment);
          });
        } else {
          this._commentSvc.addReplyToComment(this.comment._id, this.commentContent).subscribe(comment => {
            this.commentContent = "";
            this.commentType = "ItemComment";
            this._commSvc.onAddNewReply(comment);
          });
        }
      }
    }
  }

  writeVoiceComment() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this._voiceSvc.startRecord();
    } else {
      this._voiceSvc.stopRecord().then((record) => {
        this.uploadVoiceRecord(record);
      });
    }
  }

  uploadVoiceRecord(record: any) {
    const fd = new FormData();
    fd.append('voice', record.blob, record.title);
    this.http.post("https://us-central1-architect-c592d.cloudfunctions.net/uploadFile", fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.isUploading = true;
        this._log.log('Upload voice comment progress: ' + Math.round(event.loaded / event.total * 100) + "%");
      } else if (event.type === HttpEventType.Response) {
        this.isUploading = false;
        this.addVoiceCommentToItem(event.body["fileLocation"]);
        this._log.log("Finish uploading voice comment!");
      }
    });
  }

  addVoiceCommentToItem(url): void {
    if (this.commentType === "ItemComment") {
      this._log.log("Voice Comment Url: " + url);
      this._commentSvc.addVoiceCommentToItem(this.item._id, url).subscribe(voiceComment => {
        this._commSvc.changeComment(voiceComment);
      });
    } else if (this.commentType === "ReplyComment") {
      this._log.log("Voice Comment Url: " + url);
      if (this.comment.parentCommentId) {
        this._commentSvc.addVoiceReplyToComment(this.comment.parentCommentId, url).subscribe(voiceComment => {
          this.commentType = "ItemComment";
          this._commSvc.onAddNewReply(voiceComment);
        });
      } else {
        this._commentSvc.addVoiceReplyToComment(this.comment._id, url).subscribe(voiceComment => {
          this.commentType = "ItemComment";
          this._commSvc.onAddNewReply(voiceComment);
        });
      }
    }
  }

  ngOnDestroy() {
    this._log.log("onDestroy")
    this.subscription.unsubscribe();
  }
}

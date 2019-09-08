import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommunicateService } from '../services/utils/communicate.service';
import { ItemService } from '../services/item.services';
import { IItem } from '../model/item';
import { IComment } from '../model/comment';
import { CommentService } from '../services/comment.services';
import { VoiceMessageServiceService } from '../services/voice-message.service';
import { Subscription } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { LoggingService } from '../services/system/logging.service';

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

  constructor(private _itemService: ItemService,
    private _commentService: CommentService,
    private _commService: CommunicateService,
    private _voiceService: VoiceMessageServiceService,
    private _log: LoggingService,
    private http: HttpClient) {

  }

  ngOnInit() {
    this.subscription = this._commService.currentComment$.subscribe(reply => {
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
        this._itemService.addCommentToItem(this.item._id, this.commentContent).subscribe(comment => {
          this.commentContent = ""
          this._commService.changeComment(comment);
        });
      } else if (this.commentType === "ReplyComment") {
        this._log.log("Comment Content: " + this.commentContent);
        if (this.comment.parentCommentId) {
          this._commentService.addReplyToComment(this.comment.parentCommentId, this.commentContent).subscribe(comment => {
            this.commentContent = "";
            this.commentType = "ItemComment";
            this._commService.onAddNewReply(comment);
          });
        } else {
          this._commentService.addReplyToComment(this.comment._id, this.commentContent).subscribe(comment => {
            this.commentContent = "";
            this.commentType = "ItemComment";
            this._commService.onAddNewReply(comment);
          });
        }
      }
    }
  }

  writeVoiceComment() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this._voiceService.startRecord();
    } else {
      this._voiceService.stopRecord().then((record) => {
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
      this._itemService.addVoiceCommentToItem(this.item._id, url).subscribe(voiceComment => {
        this._commService.changeComment(voiceComment);
      });
    } else if (this.commentType === "ReplyComment") {
      this._log.log("Voice Comment Url: " + url);
      if (this.comment.parentCommentId) {
        this._commentService.addVoiceReplyToComment(this.comment.parentCommentId, url).subscribe(voiceComment => {
          this.commentType = "ItemComment";
          this._commService.onAddNewReply(voiceComment);
        });
      } else {
        this._commentService.addVoiceReplyToComment(this.comment._id, url).subscribe(voiceComment => {
          this.commentType = "ItemComment";
          this._commService.onAddNewReply(voiceComment);
        });
      }
    }
  }

  ngOnDestroy() {
    this._log.log("onDestroy")
    this.subscription.unsubscribe();
  }
}

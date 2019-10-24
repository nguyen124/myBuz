import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { IItem } from '../shared/model/item';
import { CommentService } from '../shared/services/comment.services';
import { Subscription } from 'rxjs';
import { VoiceMessageServiceService } from '../shared/services/voice-message.service';
import { LoggingService } from '../shared/services/system/logging.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit, OnDestroy {
  @Input()
  item: IItem;
  isRecording: boolean;
  isUploading: boolean;
  commentContent: string;
  commentType: string = "ItemComment";
  subscription: Subscription;

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    private _voiceSvc: VoiceMessageServiceService,
    private _logSvc: LoggingService) {
  }

  ngOnInit() {

  }

  writeTextComment() {
    if (this.commentContent && this.commentContent.trim()) {
      this._commentSvc.addComment(this.item._id, this.commentContent).subscribe(newComment => {
        this.commentContent = ""
        this._commentSvc.parentCommentId = null;// after reply remove parentCommentId
        this._commSvc.changeComment(newComment);
      });
    }
  }

  writeVoiceComment() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this._voiceSvc.startRecord();
    } else {
      this._voiceSvc.stopRecordAndUpload(this.item._id);
    }
  }

  ngOnDestroy() {
    this._logSvc.log("onDestroy")
    this.subscription.unsubscribe();
  }
}

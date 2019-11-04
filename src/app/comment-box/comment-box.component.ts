import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { IItem } from '../shared/model/item';
import { CommentService } from '../shared/services/comment.services';
import { VoiceMessageServiceService } from '../shared/services/voice-message.service';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    private _voiceSvc: VoiceMessageServiceService,
    private _toastr: ToastrService) {
  }

  ngOnInit() {

  }

  writeTextComment() {
    if (this.commentContent && this.commentContent.trim()) {
      this._commentSvc.addComment(this.item._id, this.commentContent, null).subscribe(newComment => {
        this.afterCommenting(newComment);
      });
    }
  }

  writeVoiceComment() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this._voiceSvc.startRecord();
    } else {
      this._voiceSvc.stopRecord().then(record => {
        this._voiceSvc.uploadVoiceRecord(record).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this._toastr.success('Upload voice comment progress: ' + Math.round(event.loaded / event.total * 100) + "%");
          } else if (event.type === HttpEventType.Response) {
            this._commentSvc.addComment(this.item._id, null, event.body["fileLocation"]).subscribe(newComment => {
              this.afterCommenting(newComment);
            });
          }
        });
      })
    }
  }

  afterCommenting(newComment) {
    this.item.noOfComments++;
    this.commentContent = ""
    this._commentSvc.parentCommentId = null;// after reply remove parentCommentId
    this._commSvc.changeComment(newComment);
  }
  ngOnDestroy() {
  }
}

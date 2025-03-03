import { Component, OnInit, Input, OnDestroy, Inject, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { IItem } from '../shared/model/item';
import { VoiceMessageServiceService } from '../shared/services/voice-message.service';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { SystemService } from '../shared/services/utils/system.service';
import { AuthService } from '../shared/services/security/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { IComment } from '../shared/model/comment';
import { CommentService } from '../shared/services/comment.services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit, OnDestroy {
  @Input() item: IItem;
  @Input() comment: IComment;
  @Input() isTopCommentBox: boolean;
  @Input() set isShowing(value: boolean) {
    this._isShowing = value;
    setTimeout(() => {
      this.setTextboxFocus();
    }, 0)
  }
  get isShowing() {
    return this._isShowing;
  }
  private _isShowing: boolean;

  @Input() set isEditting(value: boolean) {
    this._isEditting = value;
    if (this.isShowing) {
      if (value) {
        this.populateData();
      } else {
        this.reset();
      }
    }
  }
  get isEditting() {
    return this._isEditting;
  }
  private _isEditting: boolean;

  @Output() commentBoxFocused: EventEmitter<any> = new EventEmitter<any>();
  @Output() editingCommentDone: EventEmitter<IComment> = new EventEmitter<IComment>();
  @ViewChild('txtReplyBox', { static: false }) txtReplyBox: ElementRef;

  isRecording: boolean;
  isUploading: boolean;
  commentType: string = "ItemComment";
  uploadedFile: File;
  voiceRecord: any;
  textContent: string = '';
  picPreviewSrc: any;
  voicePreviewSrc: any;
  commentContent: Array<any> = [];
  uploadingProgress: number;

  constructor(
    private _commSvc: CommunicateService,
    private _voiceSvc: VoiceMessageServiceService,
    private _systemSvc: SystemService,
    private _authSvc: AuthService,
    private _router: Router,
    private _commentSvc: CommentService,
    private _translate: TranslateService,
    @Inject(JQ_TOKEN) private $: any,
    private _toastr: ToastrService,
    private _san: DomSanitizer) {
  }

  ngOnInit() {

  }

  writeTextComment() {
    if (this._authSvc.isLoggedIn()) {
      var that = this;
      that._uploadPic(that._uploadVoice);
    } else {
      this.closeModal();
      this._router.navigate(['login']);
    }
  }

  closeModal() {
    var modalDismiss = this.$("#closeModalBtn");
    if (modalDismiss && modalDismiss[0]) { modalDismiss.click(); }
  }

  _uploadPic(callback) {
    this._addTextContent();
    if (this.uploadedFile) {
      this.isUploading = true;
      this._systemSvc.uploadFile(this.uploadedFile).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // this._toastr.success('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + "%");
          this.uploadingProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          var picObj = {
            url: event.body["fileLocation"],
            filename: event.body["filename"],
            fileType: "image"
          }
          this.isUploading = false;
          this.commentContent.push(picObj);
          callback(this);
        }
      }, err => {
        this.isUploading = false;
        this._toastr.error(this._translate.instant("uploading.media.error"));
        this.reset();
      })
    } else {
      if (this.picPreviewSrc) {
        var picObj = {
          url: this.picPreviewSrc,
          fileType: "image"
        };
        this.commentContent.push(picObj);
      }
      callback(this);
    }
  }

  _addTextContent() {
    if (this.textContent) {
      var textObj = {
        url: this.textContent,
        filename: '',
        fileType: "text"
      };
      this.commentContent.push(textObj);
    }
  }

  _uploadVoice(that) {
    var thatt = that;
    if (that.voiceRecord) {
      that.isUploading = true;
      that._voiceSvc.uploadVoiceRecord(that.voiceRecord).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          //that._toastr.success('Upload voice comment progress: ' + Math.round(event.loaded / event.total * 100) + "%");
          that.uploadingProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          that.isUploading = false;
          var voiceObj = {
            url: event.body["fileLocation"],
            filename: event.body["filename"],
            fileType: "sound"
          };
          that.commentContent.push(voiceObj);
          thatt._f(that);
        }
      },
        err => {
          thatt.isUploading = false;
          thatt._toastr.error(this._translate.instant("uploading.media.error"));
          thatt.reset();
        });
    } else {
      if (thatt.voicePreviewSrc) {
        var voiceObj = {
          url: thatt.voicePreviewSrc,
          fileType: "sound"
        };
        thatt.commentContent.push(voiceObj);
      }
      thatt._f(that);
    }
  }

  _f(that) {
    if (that.commentContent.length > 0) {
      if (!that.isEditting) {
        var comment = {
          parentCommentId: (that.comment) ? (that.comment.parentCommentId || that.comment._id) : null,
          itemId: that.item._id,
          content: that.commentContent,
          replyTo: that.comment ? {
            _id: that.comment._id,
            content: that.comment.content,
            writtenBy: that.comment.writtenBy
          } : null
        }
        that._commentSvc.addComment(comment).subscribe(newComment => {
          that.afterAddingComment(newComment);
        },
          err => {
            that._toastr.error(this._translate.instant("comment.add.error"));
            that.reset();
          });
      } else {
        that._commentSvc.updateComment(that.comment, that.commentContent).subscribe(updatedComment => {
          that.removeOldMedia(that.comment.content, that.commentContent);
          that.afterEdittingComment(updatedComment);
        },
          err => {
            that._toastr.error(this._translate.instant("comment.update.error"));
            that.reset();
          });
      }
    } else {
      that._toastr.warning(this._translate.instant("comment.add.emptyError"));
    }
  }

  @ViewChild('picComment', { static: false }) picComment: ElementRef;
  picCommentPreview() {
    if (this._authSvc.isLoggedIn()) {
      if (this.isTopCommentBox) {
        this.commentBoxFocused.emit("top");
      }
      this.picComment.nativeElement.click();
    } else {
      this.closeModal();
      this._router.navigate(['login']);
    }
  }

  voiceCommentPreview() {
    if (this._authSvc.isLoggedIn()) {
      if (this.isTopCommentBox) {
        this.commentBoxFocused.emit("top");
      }
      this.isRecording = !this.isRecording;
      if (this.isRecording) {
        this._voiceSvc.startRecord();
        this.voicePreviewSrc = null;
      } else {
        this._voiceSvc.stopRecord().then(record => {
          this.voiceRecord = record;
          var blob = window.URL || window["webkitURL"];
          if (!blob) {
            this._toastr.error(this._translate.instant("common.blob.error"));
            return;
          }
          this.voicePreviewSrc = this._san.bypassSecurityTrustResourceUrl(blob.createObjectURL(<File>record["blob"]));
        })
      }
    } else {
      this.closeModal();
      this._router.navigate(['login']);
    }
  }

  changeValue(event) {
    if (event && event.currentTarget && event.currentTarget.files) {
      var that = this;
      this.uploadedFile = <File>event.currentTarget.files.item(0);
      if (this.uploadedFile) {
        var reader = new FileReader();
        reader.onload = function (e) {
          that.picPreviewSrc = e.target["result"];
        }
        reader.readAsDataURL(this.uploadedFile);
      }
    }
  }

  clearPreviewPic() {
    this.picPreviewSrc = null;
  }

  afterAddingComment(newComment) {
    this.reset();
    this.setTextboxFocus();
    this.item.noOfComments++;
    this._commSvc.changeComment(newComment);
  }

  setTextboxFocus() {
    if (this.txtReplyBox) {
      this.txtReplyBox.nativeElement.focus();
    }
  }

  reset() {
    this.textContent = '';
    this.commentContent = [];
    this.picPreviewSrc = null;
    this.voicePreviewSrc = null;
    this.uploadedFile = null;
    this.voiceRecord = null;
  }

  populateData() {
    for (var obj of this.comment.content) {
      if (obj.fileType == 'text' && obj.url.trim()) {
        this.textContent = obj.url;
      } else if (obj.fileType == 'image') {
        this.picPreviewSrc = obj.url;
      } else if (obj.fileType == 'sound') {
        this.voicePreviewSrc = obj.url;
      }
    }
  }

  afterEdittingComment(newComment) {
    this.comment = newComment;
    this.editingCommentDone.emit(newComment);
    this.reset();
  }

  removeOldMedia(oldComment, newComment) {
    var i = 0;
    for (; i < newComment.length; i++) {
      if (newComment[i].fileType === "image") {
        for (var content of oldComment) {
          if (content.fileType === "image" && content.url !== newComment[i].url) {
            this._systemSvc.deleteFileByUrl(content.url, content.fileType).subscribe((res) => {
            });
            break;
          }
        }
      }
      if (newComment[i].fileType === "sound") {
        for (var content of oldComment) {
          if (content.fileType === "sound" && content.url !== newComment[i].url) {
            this._systemSvc.deleteFileByUrl(content.url, content.fileType).subscribe((res) => {
            });
            break;
          }
        }
      }
    }
    if (i < oldComment.length) {
      for (; i < oldComment.length; i++) {
        if (oldComment[i].fileType === "image" || oldComment[i].fileType === "sound") {
          this._systemSvc.deleteFileByUrl(oldComment[i].url, oldComment[i].fileType).subscribe((res) => {
          });
        }
      }
    }
  }

  handleOnFocus() {
    if (this.isTopCommentBox) {
      this.commentBoxFocused.emit("top");
    }
  }

  removePreviewPic() {
    this.picPreviewSrc = null;
    this.uploadedFile = null;
  }

  removePreviewVoice() {
    this.voicePreviewSrc = null;
    this.voiceRecord = null;
  }

  ngOnDestroy() {
  }
}

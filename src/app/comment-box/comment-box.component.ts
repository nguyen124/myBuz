import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { CommunicateService } from '../shared/services/utils/communicate.service';
import { IItem } from '../shared/model/item';
import { CommentService } from '../shared/services/comment.services';
import { VoiceMessageServiceService } from '../shared/services/voice-message.service';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { JQ_TOKEN } from '../shared/services/jQuery.service';
import { SystemService } from '../shared/services/utils/system.service';

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
  commentType: string = "ItemComment";
  uploadedFile: File;
  voiceRecord: any;

  constructor(
    private _commentSvc: CommentService,
    private _commSvc: CommunicateService,
    private _voiceSvc: VoiceMessageServiceService,
    private _systemSvc: SystemService,
    @Inject(JQ_TOKEN) private $: any,
    private _toastr: ToastrService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.$("#txtReplyBox").focus();
    }, 1000);
  }

  writeTextComment() {
    this._uploadPic(this._uploadVoice);
  }

  voiceCommentPreview() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this._voiceSvc.startRecord();
    } else {
      this._voiceSvc.stopRecord().then(record => {
        this.voiceRecord = record;
        var that = this,
          oldPreviewVoiceDiv = this.$("#previewVoiceDiv");

        that.removeElement(oldPreviewVoiceDiv);
        var previewVoiceDiv = this.$('<div id="previewVoiceDiv" class="col-md-5"></div>'),
          newVoice = this.$(`
          <audio id='audioId' controls> 
            <source  id='voice' src='' type='audio/mpeg'> 
          </audio>`),
          removeVoiceBtn = this.$(`
          <button class="btn btn-xs btn-primary upright-corner" id="removeVoiceBtn"> 
            <span aria-hidden="true">&times;</span>
          </button>`);

        removeVoiceBtn.bind('click', () => {
          that.voiceRecord = null;
          that.removeElement(previewVoiceDiv);
        })

        var blob = window.URL || window.webkitURL;
        if (!blob) {
          this._toastr.error('Your browser does not support Blob URLs');
          return;
        }
        var fileURL = blob.createObjectURL(<File>record["blob"]);
        newVoice.children()[0].setAttribute('src', fileURL);

        this.$("#txtReplyBox").append(previewVoiceDiv.append(newVoice).append(removeVoiceBtn));
      })
    }
  }

  _uploadVoice(that) {
    var thatt = that;
    if (that.voiceRecord) {
      that._voiceSvc.uploadVoiceRecord(that.voiceRecord).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          that._toastr.success('Upload voice comment progress: ' + Math.round(event.loaded / event.total * 100) + "%");
        } else if (event.type === HttpEventType.Response) {
          var url = event.body["fileLocation"];
          that.$("#voice").attr('src', url);
          thatt._f(that);
        }
      });
    } else {
      thatt._f(that);
    }
  }

  _f(that) {
    var removeBtn = that.$("#removeVoiceBtn"),
      removePicBtn = that.$("#removePicBtn");
    that.removeElement(removeBtn);
    that.removeElement(removePicBtn);

    var el = that.$("#txtReplyBox"),
      content = el.html();

    if (content) {
      if (!that._commentSvc.edittingComment) {
        that._commentSvc.addComment(that.item._id, content, null).subscribe(newComment => {
          that.afterAddingComment(newComment);
        });
      } else {
        if (that._commentSvc.edittingComment.content !== content) {
          that._commentSvc.updateComment(that._commentSvc.edittingComment._id, content).subscribe(newComment => {
            that.afterEdittingComment(newComment)
          });
        } else {
          that.$("#txtReplyBox").html("");
        }
      }

    } else {
      that._toastr.warning("Please enter non-empty comment!")
    }
  }

  _uploadPic(callback) {
    if (this.uploadedFile) {
      this._systemSvc.uploadFile(this.uploadedFile).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this._toastr.success('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + "%");
        } else if (event.type === HttpEventType.Response) {
          var url = event.body["fileLocation"];
          this.$("#pic").attr("src", url);
          callback(this);
        }
      }, err => {
        this._toastr.error("Failed to upload profile avatar to server!. Please try again later.")
      })
    } else {
      callback(this);
    }
  }

  picCommentPreview() {
    var that = this;
    // preview pic
    this.$("#picComment").bind('change', function (event) {
      if (event && event.currentTarget && event.currentTarget.files) {
        that.uploadedFile = <File>event.currentTarget.files.item(0);
        if (that.uploadedFile) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var oldPreviewPicDiv = that.$('#previewPicDiv');
            that.removeElement(oldPreviewPicDiv);
            var previewPicDiv = that.$("<div id='previewPicDiv' class='col-md-5'></div>"),
              newPic = that.$("<img class='previewPic' id='pic'/>"),
              removePicBtn = that.$(`
                <button class="btn btn-xs btn-primary upright-corner" id="removePicBtn"> 
                <span aria-hidden="true">&times;</span>
                </button>`);
            removePicBtn.bind('click', () => {
              that.uploadedFile = null;
              that.removeElement(previewPicDiv);
            });
            newPic.attr('src', e.target["result"]);
            that.$("#txtReplyBox").append(previewPicDiv.append(newPic).append(removePicBtn));
          }
          reader.readAsDataURL(that.uploadedFile);
        }
      }
    }).click();
  }

  removeElement(element) {
    if (element) {
      element.remove();
    }
  }

  afterAddingComment(newComment) {
    this.item.noOfComments++;
    this.$("#txtReplyBox").html("");
    this._commentSvc.parentCommentId = null;// after reply remove parentCommentId
    this._commSvc.changeComment(newComment);
    this.uploadedFile = null;
    this.voiceRecord = null;
    this._commentSvc.edittingComment = null;
  }

  afterEdittingComment(newComment) {
    this.$("#txtReplyBox").html("");
    this.uploadedFile = null;
    this.voiceRecord = null;
    this._commSvc.changeComment(newComment);
  }

  ngOnDestroy() {
  }
}

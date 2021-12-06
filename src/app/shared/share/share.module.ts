import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { MemeVideoComponent } from 'src/app/meme-video/meme-video.component';
import { Mp4NotThumbPipe } from '../pipe/mp4-not-thumb.pipe';
import { Mp4Pipe } from '../pipe/mp4.pipe';
import { PosterPipe } from '../pipe/poster.pipe';

@NgModule({
  declarations: [
    Mp4Pipe,
    Mp4NotThumbPipe,
    PosterPipe,
    MemeVideoComponent
  ],
  imports: [    
    CommonModule,
    CKEditorModule
  ],
  exports: [
    Mp4Pipe,
    Mp4NotThumbPipe,
    PosterPipe,
    MemeVideoComponent,
    CommonModule,
    CKEditorModule
  ]
})
export class ShareModule { }

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { HttpLoaderFactory } from 'src/app/app.module';
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
    CKEditorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
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

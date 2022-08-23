import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { MemeVideoComponent } from 'src/app/meme-video/meme-video.component';
import { Mp4NotThumbPipe } from '../pipe/mp4-not-thumb.pipe';
import { Mp4Pipe } from '../pipe/mp4.pipe';
import { PosterPipe } from '../pipe/poster.pipe';
import { NgxEditorModule } from "ngx-editor";

@NgModule({
  declarations: [
    Mp4Pipe,
    Mp4NotThumbPipe,
    PosterPipe,
    MemeVideoComponent
  ],
  imports: [
    CommonModule,
    NgxEditorModule.forRoot({
      locals: {
        // menu
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        blockquote: 'Blockquote',
        underline: 'Underline',
        strike: 'Strike',
        bullet_list: 'Bullet List',
        ordered_list: 'Ordered List',
        heading: 'Heading',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Text Color',
        background_color: 'Background Color',

        // popups, forms, others...
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
      },
    }),
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
    NgxEditorModule
  ]
})
export class ShareModule { }

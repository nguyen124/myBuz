import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]

})
export class FileUtils {

  getFileType(path: string): string {
    let picRegex = /^.*\.(JPG|JPEG)$/i;
    let videoRegex = /^.*\.(MOV)$/i;
    let gifRegex = /^.*\.(GIF)$/i;

    if (picRegex.test(path)) {
      return 'pic';
    };
    if (videoRegex.test(path)) {
      return 'video';
    };
    if (gifRegex.test(path)) {
      return 'gif';
    }
  }
}

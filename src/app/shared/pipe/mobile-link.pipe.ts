import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageMobileLinkPipe'
})
export class ImageMobileLinkPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value.startsWith('http')) {
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      if (vw <= 425) {
        var x = value.lastIndexOf("/"),
          y = value.lastIndexOf("."),
          filename = value.substring(x + 1, y + 1),
          newValue = value.replace(filename, "thumb_" + filename);
        return newValue;
      }
    }
    return value;
  }

}

import { ElementRef, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'imageMobileLinkPipe',
    standalone: false
})
export class ImageMobileLinkPipe implements PipeTransform {
  constructor(private el: ElementRef) { }
  
  transform(value: any): any {
    if (value && value.startsWith('http')) {
      console.log(this.el.nativeElement);
      const vw = this.el.nativeElement.width;
      if (vw <= 768) {
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

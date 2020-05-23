import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'posterPipe'
})
export class PosterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      return value.replace(/\.[^/.]+$/, '_poster.gif');
    }
    return value;
  }
}
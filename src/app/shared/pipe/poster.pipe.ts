import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'posterPipe',
    standalone: false
})
export class PosterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      return value.replace(/\.[^/.]+$/, '_poster.jpg');
    }
    return value;
  }
}
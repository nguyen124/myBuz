import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mp4NotThumbPipe'
})
export class Mp4NotThumbPipe implements PipeTransform {
    transform(value: string, args: string[]): any {
        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (vw <= 425) {
            var newValue = value.replace(/\.[^.]+$/, "_output.mp4");
            return newValue;
        }
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mp4Pipe',
    standalone: false
})
export class Mp4Pipe implements PipeTransform {
    transform(value: string, args: string[]): any {
        //When video upload on storage there will be another file generated with the same name plus '_output.mp4'        
        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (vw <= 425) {
            var newValue = value.replace(/\.[^.]+$/, "_thumb_output.mp4");
            return newValue;
        } else {
            var newValue = value.replace(/\.[^.]+$/, "_output.mp4");
            return newValue;
        }
    }
}

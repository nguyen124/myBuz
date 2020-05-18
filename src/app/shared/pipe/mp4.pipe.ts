import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mp4Pipe'
})
export class Mp4Pipe implements PipeTransform {
    transform(value: string, args: string[]): any {
        //When video upload on storage there will be another file generated with the same name plus '_output.mp4'
        var newValue = value.replace(/\.[^.]+$/, "_output.mp4");
        return newValue;
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mp4Pipe'
})
export class Mp4Pipe implements PipeTransform {
    transform(value: string, args: string[]): any {
        var newValue = value.replace(/\.[^.]+$/, ".mp4");
        return newValue;
    }
}

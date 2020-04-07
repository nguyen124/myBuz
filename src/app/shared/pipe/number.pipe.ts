import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pointPipe'
})
export class NumberPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (isNaN(value)) {
            return 0;
        }
        return Math.abs(value) > 999 ? Math.sign(value) * (+(Math.abs(value) / 1000).toFixed(1)) + 'k' : Math.sign(value) * Math.abs(value);
    }

}

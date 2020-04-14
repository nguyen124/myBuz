import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reasonPipe'
})
export class ReasonPipe implements PipeTransform {
    transform(values: [], args) {
        return values.map(value => {
            if (value == 1) {
                return 'Graphic Content';
            } else if (value == 2) {
                return '18+ Content';
            } else {
                return 'Other'
            }
        })
    }
}
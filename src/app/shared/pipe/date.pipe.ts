import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datePipe',
    standalone: false
})
export class DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(args){
      return true;
    }
    return false;
  }

}

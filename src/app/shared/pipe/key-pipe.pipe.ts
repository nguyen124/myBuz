import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keyPipe'
})
export class KeyPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        let keys = [];
        for (let key in value) {
            if (key !== 'tag' && key !== 'category') {
                continue;
            }
            keys.push(key);
        }
        return keys;
    }
}

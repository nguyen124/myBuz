import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keyPipe',
    standalone: false
})
export class KeyPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        let keys = [];
        for (let key in value) {
            if (key !== 'tag' && key !== 'category'
                && key !== "address" && key !== "zipcode" && key !== "city"
                && key !== "state" && key !== "country"
                && key !== "minPrice" && key !== "maxPrice" && key !== "keyword") {
                continue;
            }
            keys.push(key);
        }
        return keys;
    }
}

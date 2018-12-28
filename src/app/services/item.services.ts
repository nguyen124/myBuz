import { Injectable } from '@angular/core';
import { IItem } from '../model/item';


@Injectable()
export class ItemService {
    getItems(): IItem[] {
        return [
            { id: 10, title: 'Hello 3', description: 'Hi Hai dap chai', url: '../../assets/image/img3.JPG', modifiedDate: '12/30/2019', viewed: "notSeen" },
            { id: 11, title: 'Hello 1', description: 'Hi Hai dap chai', url: '../../assets/image/img1.JPG', modifiedDate: '12/21/2019', viewed: "seen" },
            { id: 12, title: 'Hello 2', description: 'Hi Hai dap chai', url: '../../assets/image/img2.JPG', modifiedDate: '12/22/2019', viewed: "glanced" },
            { id: 13, title: 'Hello 3', description: 'Hi Hai dap chai', url: '../../assets/image/img3.JPG', modifiedDate: '12/23/2019', viewed: "seen" },
            { id: 14, title: 'Hello 4', description: 'Hi Hai dap chai', url: '../../assets/image/img4.JPG', modifiedDate: '12/24/2019', viewed: "seen" },
            { id: 15, title: 'Hello 5', description: 'Hi Hai dap chai', url: '../../assets/image/img5.JPG', modifiedDate: '12/25/2019', viewed: "glanced" },
            { id: 16, title: 'Hello 6', description: 'Hi Hai dap chai', url: '../../assets/image/img6.JPG', modifiedDate: '12/26/2019', viewed: "seen" },
            { id: 17, title: 'Gif1   ', description: 'Gif            ', url: '../../assets/gif/giphy1.gif', modifiedDate: '12/27/2019', viewed: "notSeen" },
            { id: 18, title: 'Gif2   ', description: 'Gif            ', url: '../../assets/gif/giphy2.gif', modifiedDate: '12/28/2019', viewed: "notSeen" },
            { id: 19, title: 'Hello 2', description: 'Hi Hai dap chai', url: '../../assets/image/img2.JPG', modifiedDate: '12/29/2019', viewed: "notSeen" }
        ];
    }
}
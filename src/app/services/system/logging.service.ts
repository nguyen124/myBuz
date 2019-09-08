import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  constructor() { }

  log(message): void {
    if (!environment.production) {
      console.log(message);
    }
  }
}

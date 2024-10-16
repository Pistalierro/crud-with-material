import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  errorHandler(err: any): void {
    console.log(`Operation failed: ${err.message}`);
  }
}

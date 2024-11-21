import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  errorHandler<T>(operation: string, res?: T): any {
    return (err: any): Observable<T> => {
      console.log(`${operation} failed: ${err}`);
      return of(res as T);
    };
  }
}

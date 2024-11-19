import {inject, Injectable} from '@angular/core';

import {ProductInterface} from '../types/product.interface';
import {from, Observable} from 'rxjs';
import {collection, doc, Firestore, setDoc} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private firestore = inject(Firestore);

  createData(product: ProductInterface): Observable<void> {
    const id = doc(collection(this.firestore, 'productsList')).id;
    return from(setDoc(doc(this.firestore, 'productsList', id), {...product, id}));
  }

  
}

import {inject, Injectable} from '@angular/core';
import {ProductInterface} from '../types/product.interface';
import {from, map, Observable} from 'rxjs';
import {collection, collectionData, doc, Firestore, setDoc} from '@angular/fire/firestore';
import {Timestamp} from 'firebase/firestore'; // Импортируем Timestamp

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private firestore = inject(Firestore);

  createData(product: ProductInterface): Observable<void> {
    const id = doc(collection(this.firestore, 'productsList')).id;
    return from(setDoc(doc(this.firestore, 'productsList', id), {...product, id}));
  }

  readData(): Observable<ProductInterface[]> {
    const productCollection = collection(this.firestore, 'productsList');
    return collectionData(productCollection, {idField: 'id'}).pipe(
      map((products: ProductInterface[]) =>
        products.map((product: ProductInterface) => ({
          ...product,
          date: product.date instanceof Timestamp
            ? product.date.toDate()
            : product.date
        }))
      )
    ) as Observable<ProductInterface[]>;
  }
}

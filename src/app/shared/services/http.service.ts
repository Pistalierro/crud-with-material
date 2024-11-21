import {inject, Injectable} from '@angular/core';
import {ProductInterface} from '../types/product.interface';
import {catchError, from, map, Observable} from 'rxjs';
import {collection, collectionData, deleteDoc, doc, Firestore, setDoc, updateDoc} from '@angular/fire/firestore';
import {Timestamp} from 'firebase/firestore';
import {UtilsService} from './utils.service'; // Импортируем Timestamp

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private firestore = inject(Firestore);
  private utilsService = inject(UtilsService);

  createData(product: ProductInterface): Observable<void> {
    const id = doc(collection(this.firestore, 'productsList')).id;
    return from(setDoc(doc(this.firestore, 'productsList', id), {...product, id})).pipe(
      catchError(this.utilsService.errorHandler('CREATE DATA'))
    );
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
      ),
      catchError(this.utilsService.errorHandler<ProductInterface[]>('READ DATA'))
    ) as Observable<ProductInterface[]>;
  }

  updateData(collectionName: string, documentId: string, product: ProductInterface): Observable<ProductInterface> {
    const documentRef = doc(this.firestore, `${collectionName}/${documentId}`);
    const updateData = {...product};
    return from(updateDoc(documentRef, updateData)).pipe(
      catchError(this.utilsService.errorHandler<ProductInterface>('UPDATE DATA'))
    );
  }

  deleteData(collectionName: string, documentId: string): Observable<void> {
    const documentRef = doc(this.firestore, `${collectionName}/${documentId}`);
    return from(deleteDoc(documentRef)).pipe(
      catchError(this.utilsService.errorHandler('DELETE DATA'))
    );
  }
}

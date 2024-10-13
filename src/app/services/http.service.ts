import {inject, Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductInterface} from '../shared/types/product.interface';
import {API_POINTS} from '../shared/mock/api-points';
import {RequestProductInterface} from '../shared/types/requestProduct.interface';
import {map, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  productList: ProductInterface[] = [];

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  private http = inject(HttpClient);

  constructor(@Inject('API_URL') private apiUrl: string) {
  }

  createData(product: ProductInterface): Observable<void> {
    return this.http.post<RequestProductInterface>(`${this.apiUrl}${API_POINTS.productList}.json`, product, this.httpOptions).pipe(
      map((res: RequestProductInterface) => {
        this.productList.push({...{key: res.name, ...product}});
      }));
  }

  readData() {
    return this.http.get(`${this.apiUrl}${API_POINTS.productList}.json`, this.httpOptions);
  }

  updateData() {
  }

  deleteData() {
  }
}

import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {HttpService} from './shared/services/http.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TABLE_COLUMNS} from './mock/table-data';
import {ProductInterface} from './shared/types/product.interface';
import {CurrencyPipe, DatePipe, UpperCasePipe} from '@angular/common';
import {TextLengthPipe} from './shared/pipes/text-length.pipe';
import {catchError, from, map, Observable, of, switchAll, tap} from 'rxjs';
import {DialogComponent} from './dialog/dialog.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    UpperCasePipe,
    CurrencyPipe,
    TextLengthPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = TABLE_COLUMNS;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private httpService = inject(HttpService);

  ngOnInit() {
    this.getAllProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(data: any = null, expectedResult: string): Observable<string | undefined> {
    return from(import('./dialog/dialog.component')).pipe(
      map(({DialogComponent}) => {
        return this.dialog.open(DialogComponent, {
          width: '40%',
          data
        }).afterClosed();
      }),
      switchAll(),
      tap((res: string) => {
        if (res === expectedResult) {
          console.log(`Товар успешно ${expectedResult.trim()}`);
        }
      }),
      catchError(err => {
        console.error('Ошибка при закрытии диалогового окна:', err);
        return of(undefined);
      })
    );
  }

  createProduct(): void {
    this.openDialog(null, 'created').subscribe();
  }

  updateProduct(row: ProductInterface): void {
    this.openDialog(row, 'updated').subscribe();
  }

  deleteProduct(id: string): void {
    this.httpService.deleteData('productsList', id).subscribe({
      next: () => {
        console.log('Товар успешно удален');
      }
    });
  }

  private getAllProducts(): void {
    this.httpService.readData().subscribe({
      next: (res: ProductInterface[]) => {
        this.dataSource = new MatTableDataSource<any>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
}

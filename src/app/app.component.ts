import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {HttpService} from './shared/services/http.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {TABLE_COLUMNS} from './mock/table-data';
import {ProductInterface} from './shared/types/product.interface';
import {CurrencyPipe, DatePipe, UpperCasePipe} from '@angular/common';
import {TextLengthPipe} from './shared/pipes/text-length.pipe';
import {catchError, from, map, Observable, switchAll, tap} from 'rxjs';
import {MATERIAL_MODULES} from './shared/mock/material.modules.mock';
import {UtilsService} from './shared/services/utils.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DatePipe,
    UpperCasePipe,
    CurrencyPipe,
    TextLengthPipe,
    MATERIAL_MODULES
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
  private utilsService = inject(UtilsService);

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
    return from(import('./components/dialog/dialog.component')).pipe(
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
      catchError(this.utilsService.errorHandler('OPEN DIALOG'))
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
      },
      error: catchError(this.utilsService.errorHandler('DELETE'))
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

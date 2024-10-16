import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {DialogComponent} from './components/dialog/dialog.component';
import {HttpService} from './services/http.service';
import {ProductInterface} from './shared/types/product.interface';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {PRODUCT_COLUMNS} from './mock/table-data';
import {CurrencyPipe, DatePipe, UpperCasePipe} from '@angular/common';
import {LengthPipe} from './shared/pipes/length.pipe';
import {provideNativeDateAdapter} from '@angular/material/core';
import {ErrorService} from './shared/services/error.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    CurrencyPipe,
    UpperCasePipe,
    LengthPipe,
  ],
  providers: [
    provideNativeDateAdapter(),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  displayedColumns: string[] = PRODUCT_COLUMNS;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly dialog = inject(MatDialog);
  private httpService = inject(HttpService);
  private errorService = inject(ErrorService);

  ngOnInit(): void {
    this.getAllProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createProduct() {
    this.dialog.open(DialogComponent, {
      width: '40%',
    }).afterClosed().subscribe({
      next: (res: string) => {
        if (res === 'created') this.getAllProducts();
      },
      error: this.errorService.errorHandler
    });
  }

  updateProduct(row: ProductInterface): void {
    this.dialog.open(DialogComponent, {
      width: '40%',
      data: row
    }).afterClosed().subscribe({
      next: (res: string) => {
        if (res === 'updated') this.getAllProducts();
      },
      error: this.errorService.errorHandler
    });
  }

  deleteProduct(key: string): void {
    this.httpService.deleteData(key).subscribe({
      next: () => this.getAllProducts(),
      error: this.errorService.errorHandler
    });
  }

  private getAllProducts(): void {
    this.httpService.readData().subscribe({
      next: (res: ProductInterface[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: this.errorService.errorHandler
    });
  }
}

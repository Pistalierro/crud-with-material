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

  async openDialog() {
    const {DialogComponent} = await import('./dialog/dialog.component');
    this.dialog.open(DialogComponent, {
      width: '40%',
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

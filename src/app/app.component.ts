import {Component, inject, OnInit} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {DialogComponent} from './components/dialog/dialog.component';
import {HttpService} from './services/http.service';
import {ProductInterface} from './shared/types/product.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  private httpService = inject(HttpService);

  ngOnInit(): void {
    this.getAllProducts();
  }

  createProduct() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '40%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  private getAllProducts(): void {
    this.httpService.readData().subscribe({
      next: (res: ProductInterface[]) => {
        
      },
      error: err => console.log(err)
    });
  }
}

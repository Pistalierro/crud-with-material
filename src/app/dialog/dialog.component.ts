import {Component, Inject, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PRODUCT_CATEGORIES, PRODUCT_CONDITION} from '../mock/form-data';
import {NgForOf} from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {HttpService} from '../shared/services/http.service';
import {ProductInterface} from '../shared/types/product.interface';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    NgForOf,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatDatepickerModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {

  form!: FormGroup;
  productCategories: string[] = PRODUCT_CATEGORIES;
  productCondition: string[] = PRODUCT_CONDITION;
  actionBtn: string = 'Сохранить';

  dialogRef = inject(MatDialogRef<DialogComponent>);

  private fb = inject(FormBuilder);
  private httpService = inject(HttpService);

  constructor(@Inject(MAT_DIALOG_DATA) public editData: ProductInterface) {
  }

  ngOnInit() {
    this.initializeForm();
    if (this.editData) {
      this.actionBtn = 'Изменить';
      this.form.patchValue(this.editData);
      console.log(this.form.value);
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      category: [null, [Validators.required]],
      date: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      price: [null, [Validators.required]],
      comment: [null, [Validators.required]],
    });
  }

  addProduct(): void {
    if (this.form.valid) {
      this.httpService.createData(this.form.value).subscribe({
        next: () => {
          console.log('product created');
          this.form.reset();
          this.dialogRef.close('created');
        },
        error: err => console.log(err),
      });
    }
  }

  updateProduct(): void {
    if (this.form.valid && this.editData.id) {
      const updatedProduct = {...this.editData, ...this.form.value};
      this.httpService.updateData('productsList', this.editData.id, updatedProduct).subscribe({
        next: () => {
          console.log('product updated');
          this.form.reset();
          this.dialogRef.close('updated');
        },
        error: err => console.log(err),
      });
    }
  }
}

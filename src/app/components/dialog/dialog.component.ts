import {Component, Inject, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {PRODUCT_CATEGORIES, PRODUCT_CONDITION} from '../../mock/form-data';
import {HttpService} from '../../shared/services/http.service';
import {ProductInterface} from '../../shared/types/product.interface';
import {MATERIAL_MODULES} from '../../shared/mock/material.modules.mock';
import {catchError} from 'rxjs';
import {UtilsService} from '../../shared/services/utils.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    MATERIAL_MODULES
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
  private utilsService = inject(UtilsService);

  constructor(@Inject(MAT_DIALOG_DATA) public editData: ProductInterface) {
  }

  ngOnInit() {
    this.initializeForm();
    this.setEditValuesForm();
  }

  addProduct(): void {
    if (this.form.valid) {
      this.httpService.createData(this.form.value).subscribe({
        next: () => {
          this.form.reset();
          this.dialogRef.close('created');
        },
        error: catchError(this.utilsService.errorHandler('ADD PRODUCT'))
      });
    }
  }

  updateProduct(): void {
    if (this.form.valid && this.editData.id) {
      const updatedProduct = {...this.editData, ...this.form.value};
      this.httpService.updateData('productsList', this.editData.id, updatedProduct).subscribe({
        next: () => {
          this.form.reset();
          this.dialogRef.close('updated');
        },
        error: catchError(this.utilsService.errorHandler('UPDATE PRODUCT'))
      });
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      category: [null, [Validators.required]],
      date: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      price: [null, [Validators.required]],
      comment: [null, [Validators.required]],
    });
  }

  private setEditValuesForm(): void {
    if (this.editData) {
      this.actionBtn = 'Изменить';
      this.form.patchValue(this.editData);
      console.log(this.form.value);
    }
  }
}

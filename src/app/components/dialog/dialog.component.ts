import {ChangeDetectionStrategy, Component, Inject, inject, input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {FORM_LABELS, FORM_PLACEHOLDERS} from '../../mock/form-data';
import {PRODUCT_CATEGORIES, PRODUCT_CONDITION_LIST} from '../../mock/product-data';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgForOf} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {HttpService} from '../../services/http.service';
import {provideNativeDateAdapter} from '@angular/material/core';
import {ProductInterface} from '../../shared/types/product.interface';
import {ErrorService} from '../../shared/services/error.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    NgForOf,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {

  form!: FormGroup;
  formLabels = FORM_LABELS;
  formPlaceholders = FORM_PLACEHOLDERS;
  productCategories = PRODUCT_CATEGORIES;
  productConditionList = PRODUCT_CONDITION_LIST;
  actionBtn: string = 'Сохранить';

  protected readonly input = input;
  private fb = inject(FormBuilder);
  private httpService = inject(HttpService);
  private errorService = inject(ErrorService);

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public editData: any) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      date: ['', [Validators.required]],
      productCondition: ['', [Validators.required]],
      price: ['', [Validators.required]],
      comment: ['', [Validators.required]],
    });
    if (this.editData) {
      this.actionBtn = 'Изменить';
      Object.keys(this.form.controls).forEach(key => this.form.controls[key].setValue(this.editData[key as keyof ProductInterface]));
    }
  }

  addProduct(): void {
    if (this.form.valid) {
      this.httpService.createData(this.form.value).subscribe({
        next: () => {
          console.log('Product added: ');
          this.form.reset();
          this.dialogRef.close('created');
        },
        error: this.errorService.errorHandler
      });
    }
  }

  updateProduct(): void {
    if (this.editData.key)
      this.httpService.updateData(this.form.value, this.editData.key).subscribe({
        next: () => this.dialogRef.close('updated'),
        error: this.errorService.errorHandler
      });
  }
}

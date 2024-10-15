import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {FORM_LABELS, FORM_PLACEHOLDERS} from '../../mock/form-data';
import {PRODUCT_CATEGORIES, PRODUCT_CONDITION_LIST} from '../../mock/product-data';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgForOf} from '@angular/common';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {HttpService} from '../../services/http.service';
import {provideNativeDateAdapter} from '@angular/material/core';

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

  @ViewChild('picker') datepicker!: MatDatepicker<any>; // Доступ к Datepicker
  form!: FormGroup;
  formLabels = FORM_LABELS;
  formPlaceholders = FORM_PLACEHOLDERS;
  productCategories = PRODUCT_CATEGORIES;
  productConditionList = PRODUCT_CONDITION_LIST;
  private fb = inject(FormBuilder);
  private httpService = inject(HttpService);

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
  ) {
  }

  onDateChange(event: any): void {
    console.log('Дата выбрана:', event.value);
    this.datepicker.close();
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
  }

  addProduct(): void {
    this.httpService.createData(this.form.value).subscribe({
      next: () => {
        console.log('Product added: ',);
        this.form.reset();
        this.dialogRef.close('created');
      },
      error: err => console.log(err)
    });
  }
}

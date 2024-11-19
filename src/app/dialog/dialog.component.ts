import {Component, inject, OnInit} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PRODUCT_CATEGORIES, PRODUCT_CONDITION} from '../mock/form-data';
import {NgForOf} from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';

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

  private fb = inject(FormBuilder);

  ngOnInit() {
    this.initializeForm();
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
}

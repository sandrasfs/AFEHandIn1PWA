import { MatDialogRef } from '@angular/material/dialog';
import { Transaction } from '../datamodels';
import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule} from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CURRENCIES } from '../datamodels';
import { TransactionService } from '../services/transaction.service';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter} from '@angular/material/core';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { map } from 'rxjs/operators';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [FormsModule, 
    MatTableModule,
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatDialogModule,
    MatDividerModule,
    MatGridListModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatAutocompleteModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-dialog.component.html',
  providers: [provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_LOCALE, useValue: 'da-DK' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
  styleUrls: ['./transaction-dialog.component.scss']
})

export class TransactionDialogComponent {
  transactionForm: FormGroup;
  currencies = CURRENCIES;
  transactionService = inject(TransactionService);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<TransactionDialogComponent>);
  creditCards$ = this.transactionService.httpService.getCreditCards().pipe(
    map(cards => cards.sort((a, b) => a.cardholder_name.localeCompare(b.cardholder_name)))
  );;
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  
  constructor() {
    this.transactionForm = this.fb.group({
      amount: ['', Validators.required],
      comment: '',
      date: ['', Validators.required],
      currency: ['', Validators.required],
      creditCardNumber: ['', Validators.required],
      credit_card: this.fb.group({
        card_number: [{ value: '', disabled: true }],
        csc_code: [{ value: '', disabled: true }],
        cardholder_name: [{ value: '', disabled: true }],
        expiration_date_month: [{ value: '', disabled: true }],
        expiration_date_year: [{ value: '', disabled: true }],
        issuer: [{ value: '', disabled: true }],
      }),
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.creditCards$.subscribe(creditCards => {
        const creditCardInformation = creditCards.find(
          card => card.card_number === this.transactionForm.value.creditCardNumber
        )!;
  
        const transactionDataToPost: Transaction = {
          amount: this.transactionForm.get('amount')!.value,
          comment: this.transactionForm.get('comment')!.value,
          date: this.transactionForm.get('date')!.value,
          currency: this.transactionForm.get('currency')!.value,
          credit_card: creditCardInformation
        };
  
        this.transactionService.addTransaction(transactionDataToPost); 
        this.dialogRef.close();
      });
    }
  }
  
  onCancel() {
    this.dialogRef.close();
  }

  onCreditCardChange() {
    const selectedCardNumber = this.transactionForm.get('creditCardNumber')!.value;
  
    this.creditCards$.subscribe(creditCards => {
      const selectedCard = creditCards.find(card => card.card_number === selectedCardNumber);
  
      if (selectedCard) {
        this.transactionForm.patchValue({
          credit_card: {
            card_number: selectedCard.card_number,
            csc_code: selectedCard.csc_code,
            cardholder_name: selectedCard.cardholder_name,
            expiration_date_month: selectedCard.expiration_date_month,
            expiration_date_year: selectedCard.expiration_date_year,
            issuer: selectedCard.issuer,
          },
        });
      }
    });
  }  
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Transaction } from '../datamodels';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private filterSubject = new BehaviorSubject<string>(''); 
  private sortSubject = new BehaviorSubject<Sort | null>(null);

  transactions$: Observable<Transaction[]> = combineLatest([
    this.transactionsSubject.asObservable(),
    this.filterSubject.asObservable(),
    this.sortSubject.asObservable()
  ]).pipe(
    map(([transactions, filterText, sort]) => {
      let filteredTransactions = transactions;
      if (filterText.trim()) {
        const lowerFilter = filterText.trim();
        filteredTransactions = transactions.filter(transaction =>
          transaction.credit_card.card_number.toString().toLowerCase().includes(lowerFilter)
        );
      }

      if (sort && sort.active && sort.direction) {
        const isAsc = sort.direction === 'asc';
        filteredTransactions = filteredTransactions.sort((a, b) => {
          switch (sort.active) {
            case 'card_number':
              return compare(a.credit_card.card_number, b.credit_card.card_number, isAsc);
            case 'cardholder_name':
              return compare(a.credit_card.cardholder_name, b.credit_card.cardholder_name, isAsc);
            case 'amount':
              return compare(a.amount, b.amount, isAsc);
            case 'currency':
              return compare(a.currency, b.currency, isAsc);
            case 'comment':
              return compare(a.comment, b.comment, isAsc);
            case 'date':
              return compare(a.date, b.date, isAsc);
            default:
              return 0;
          }
        });
      }

      return filteredTransactions;
    })
  );

  httpService = inject(HttpService);

  public loadTransactions(): void {
    this.httpService.getTransactions().subscribe(transactions => {
      this.transactionsSubject.next(transactions);  
    });
  }

  public addTransaction(transaction: Transaction): void {
    this.httpService.addTransaction(transaction).subscribe(() => {
      this.loadTransactions(); 
    });
  }

  public removeTransaction(uid: string): void {
    this.httpService.deleteTransaction(uid).subscribe({
      next: () => {
        const updatedTransactions = this.transactionsSubject.value.filter(transaction => transaction.uid !== uid);
        this.transactionsSubject.next(updatedTransactions);  

        const currentFilter = this.filterSubject.value;
        this.setFilter(currentFilter);
      },
      error: (error) => {
        console.error('Error deleting transaction', error);
      }
    });
  }

  public setFilter(filter: string): void {
    this.filterSubject.next(filter);  
  }

  public setSort(sort: Sort): void {
    this.sortSubject.next(sort); 
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

import { Component, Input, OnInit, ViewChild, inject, AfterViewInit} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../datamodels';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [FormsModule, 
    MatTableModule,
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule,
    MatSortModule,
    DatePipe,
    MatPaginatorModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit {
  displayedColumns: string[] = ['card_number', 'cardholder_name', 'amount', 'currency', 'comment', 'date', 'delete'];
  dataSource = new MatTableDataSource<Transaction>([]); 
  filterText: string = '';
  @Input() fixedCardNumber: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 

  transactionService = inject(TransactionService);

  ngAfterViewInit() {    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.transactionService.loadTransactions();
    this.transactionService.transactions$.subscribe(transactions => {
      this.dataSource.data = transactions; 
    });

    if(this.fixedCardNumber) {
      this.transactionService.setFilter(this.fixedCardNumber.toString());
    }
    else {
      this.clearFilter();
    }
  }

  onFilterChange(value: string): void {
    this.transactionService.setFilter(value); 
  }

  clearFilter(): void {
    this.onFilterChange(''); 
  }

addTransaction(): void {
  // THIS IS NOT DELETED BECAUSE OF LEARNING REASONS/EXPERIENCES
  // this.transactionService.transactions$.pipe( 
  //   take(1),
  //   switchMap(transactionList => {
  //     let creditCards: CreditCard[] = transactionList.map(transaction => transaction.credit_card);
  //     return of(creditCards);
  //   }),
  //   tap(creditCards => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '600px';
      dialogConfig.height = '600px';
      //dialogConfig.data = { creditCards };
      this.dialog.open(TransactionDialogComponent, dialogConfig);
  //   })
  // ).subscribe();
}

  removeTransaction(uid: string | null): void {
    if (uid) {
      this.transactionService.removeTransaction(uid);
    }
  }

  sortData(sort: Sort): void {
    this.transactionService.setSort(sort);
  }
}

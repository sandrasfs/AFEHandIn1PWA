import { Component, inject, OnInit } from '@angular/core';
import { CreditCard } from '../../datamodels';
import { HttpService } from '../../services/http.service';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-credit-card-list',
  standalone: true,
  imports: [MatTableModule, AsyncPipe, RouterLink],
  templateUrl: './credit-card-list.component.html',
  styleUrl: './credit-card-list.component.scss',
})

export class CreditCardListComponent implements OnInit {
  creditCards$: Observable<CreditCard[]> | undefined;
  tempCards: CreditCard[]=[]
  httpService= inject(HttpService)

  ngOnInit(): void {
    this.getCreditCardList()
  }
  getCreditCardList() {
    this.creditCards$=this.httpService.getCreditCards()
    // this.httpService.getCreditCards().subscribe({
    //   next: data=>this.tempCards=data,
    //   error: e=>console.error('Credit card list error: ', e)
    // })
   
  }

}

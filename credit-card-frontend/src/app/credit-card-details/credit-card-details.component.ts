import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TransactionListComponent } from "../transaction-list/transaction-list.component";
import { ActivatedRoute } from '@angular/router';
import { CreditCard } from '../datamodels';
import { HttpService } from '../services/http.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ShortYearFromFullYearPipe } from '../pipes/short-year-from-full-year.pipe';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-credit-card-details',
  standalone: true,
  imports: [TransactionListComponent, AsyncPipe, ShortYearFromFullYearPipe, MatIconModule],
  templateUrl: './credit-card-details.component.html',
  styleUrl: './credit-card-details.component.scss'
})
export class CreditCardDetailsComponent implements OnInit {
  private route=inject(ActivatedRoute)
  private httpService=inject(HttpService)
  private toastr=inject(ToastrService)
  private changeDetector=inject(ChangeDetectorRef)
  credit_card_number: number|undefined
  creditCard$: Observable<CreditCard> | undefined

  
  
  ngOnInit(): void {
    this.credit_card_number = Number(this.route.snapshot.paramMap.get('id'));
    if(this.credit_card_number!==undefined){
      this.creditCard$=this.httpService.getCreditCard(this.credit_card_number)
    }
  }

  remove():void{
    if(this.credit_card_number!=undefined)
    {
      this.httpService.deleteCreditCard(this.credit_card_number).pipe(
        tap(()=>{
          this.creditCard$=undefined
          this.toastr.success('Kreditkortet blev succesfuldt slettet')
          this.changeDetector.detectChanges()
        }),
        catchError((e)=>
        {
          this.toastr.error('Kort kan ikke slettes, der opstod en fejl\n', e)
          return of()
        })
      ).subscribe();
      
    }
    
  }

}

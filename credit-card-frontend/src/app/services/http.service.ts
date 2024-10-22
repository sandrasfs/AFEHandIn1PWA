import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CreditCard, Transaction } from '../datamodels';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl + '/transactions');
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl + '/transactions', transaction);
  }

  deleteTransaction(uid: string | null): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl + '/transactions'}/${uid}`);
  }

  addCreditCard(creditCard: CreditCard):Observable<CreditCard>{
    return this.http.post<CreditCard>(this.apiUrl + '/cards', creditCard)
  }


  getCreditCards():Observable<CreditCard[]>{
    return this.http.get<CreditCard[]>(this.apiUrl + '/cards')
  }

  getCreditCard(card_number: number): Observable<CreditCard>{
    // const headers = new HttpHeaders({'Content-Type': 'application/json'})
    // const params =new HttpParams().set('card_number', card_number)
    // return this.http.get<CreditCard>(this.apiUrl + `/cards/${card_number}`, {headers, params})
    
    return this.http.get<CreditCard>(this.apiUrl + `/cards/${card_number}`)
  }

  deleteCreditCard(card_number: number): Observable<void>{
    const url = `${this.apiUrl}/cards/${card_number}`;
    return this.http.delete<void>(url);
  }
}

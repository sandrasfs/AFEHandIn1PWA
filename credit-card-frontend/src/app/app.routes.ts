import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddCreditCardComponent } from './add-credit-card/add-credit-card.component';
import { HomeComponent } from './home/home.component';
import { CreditCardDetailsComponent } from './credit-card-details/credit-card-details.component';
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to 'home' by default
    { path: 'home', component: HomeComponent },
    { path: 'home/:id', component: CreditCardDetailsComponent},
    { path: 'add-credit-card', component: AddCreditCardComponent},
    { path: 'transactions', 
      loadChildren:() => import('./transaction/transaction.module').then(m => m.TransactionModule)
    },
    { path: 'page-not-found', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/page-not-found' } // Wildcard route for 404
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
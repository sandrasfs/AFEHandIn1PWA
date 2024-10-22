import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { HttpService } from '../services/http.service';
import { CreditCard } from '../datamodels';
import { catchError, finalize, map, of, switchMap, take, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-add-credit-card',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatLabel],
  
  templateUrl: './add-credit-card.component.html',
  styleUrl: './add-credit-card.component.scss'
})
export class AddCreditCardComponent  {
  formBuilder= inject(FormBuilder)
  httpService=inject(HttpService)
  private toastr=inject(ToastrService);


  cardForm= this.formBuilder.group({
    card_number:['', {
      validators: [Validators.required, this.digitLengthValidator(7, 16)],
      updateOn: 'blur'
    }], // Validators.minLength(7), Validators.maxLength(13) only works on string in puts
    csc_code:['', {
      validators:[Validators.required,this.digitLengthValidator(3,3)],
      updateOn: 'blur'
    }], //array of syncronous validatores
    cardholder_name: ['', Validators.required],
    expiration_date_month: ['',[ Validators.required, Validators.min(1), Validators.max(12)]],
    expiration_date_year: ['', Validators.required],
    issuer: ['', Validators.required]
    
  })
  
  digitLengthValidator(minLength: number, maxLenght: number): ValidatorFn{
    return(control: AbstractControl) : ValidationErrors | null =>{
      const value=control.value ? control.value.toString() : '';
      // if(value.length>=minLength && value.length<=maxLenght){
      //   return null
      // }

      // return {digitLength: false}
      
      return (value.length>=minLength && value.length<=maxLenght) == true ? null : {digitLength: false};
    }
  }

  onSubmit():void{
    const value= this.cardForm.value;
    const card: CreditCard={
      card_number: Number(value.card_number), 
      csc_code: Number(value.csc_code), 
      cardholder_name: value.cardholder_name?? '',
      expiration_date_month: Number(value.expiration_date_month),
      expiration_date_year: Number(value.expiration_date_year),
      issuer: value.issuer ?? ''
    }
    this.httpService.addCreditCard(card).pipe(
      take(1),
      switchMap((savedCard=> {
        return of(savedCard)})),
      tap(()=>{
        
          this.toastr.success("Kort for bruger" + card.cardholder_name + " er succesfuldt gemt" )
          this.cardForm.reset()
        }
      ),
      catchError((error)=>
      {
        this.toastr.error('Der opstod en fejl: ', error)
        return of()
      })
    ).subscribe();
  }

  private handleAddCard(card: CreditCard): void{

  }

}

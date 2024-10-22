import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortYearFromFullYear',
  standalone: true
})
export class ShortYearFromFullYearPipe implements PipeTransform {

  transform(value: string): string {
    if(value.length===4){
      return value[2]+value[3]
    }
    return '';
  }

}

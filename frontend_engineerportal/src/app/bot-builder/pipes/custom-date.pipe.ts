import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class DatePipe implements PipeTransform {
  transform(date: Object): string {
    const formattedDate = date && date['formatted'] ? date['formatted'] : 'Please select a date';

    return formattedDate;
  }
}

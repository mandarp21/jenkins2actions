import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
  transform() {}
}

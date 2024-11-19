import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'length',
  standalone: true
})
export class LengthPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
